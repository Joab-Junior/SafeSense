<?php
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/../logs/php_errors.log'); // Não deixe de criar essa pasta e esse arquivo caso esteja rodando localmente e não tenha a pasta ainda!
    error_reporting(E_ALL);

    require_once __DIR__ . '/../config/headers.php';
    require_once __DIR__ . '/../config/database.php';
    require_once __DIR__ . '/../helper/jwtHandler.php';
    require_once __DIR__ . '/../config/response.php';

    use Dotenv\Dotenv;

    // Carrega variáveis de ambiente
    $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        jsonResponse('error', 'Método não permitido. Use GET.');
        exit;
    }

    // Captura os headers HTTP
    $headers = getallheaders();

    // Tenta pegar o segredo do header 'X-App-Secret'
    $appSecret = $headers['X-App-Secret'] ?? '';

    // Se não existir no header, tenta pegar do corpo JSON
    if (!$appSecret) {
        $input = json_decode(file_get_contents('php://input'), true);
        $appSecret = $input['appSecret'] ?? '';
    }

    // Compara com o valor correto do .env
    $envSecret = $_ENV['APP_SECRET'] ?? null;

    // Valida o segredo
    if (!$envSecret || $appSecret !== $envSecret) {
        http_response_code(403);
        jsonResponse('error', 'Acesso negado: app secret inválido.');
        exit;
    }

    $authHeader = $headers['Authorization'] ?? '';

    if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
        http_response_code(401);
        jsonResponse('error', 'Token ausente.');
        exit;
    }

    $token = trim(str_replace('Bearer ', '', $authHeader));
    $jwt = new JWTHandler();
    $payload = $jwt->validateToken($token);

    if (!$payload) {
        http_response_code(401);
        jsonResponse('error', 'Token inválido ou expirado.');
        exit;
    }

    $user_id = $payload->user_id;

    $stmt = $conn->prepare("SELECT nm_usuario AS nome, em_usuario AS email FROM usuarios WHERE id_usuario = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        jsonResponse('success', 'Dados do perfil carregados com sucesso.', $user);
    } else {
        http_response_code(404);
        jsonResponse('error', 'Usuário não encontrado.');
    }
?>