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

    // Verifica se o método é DELETE
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        http_response_code(405);
        jsonResponse('error', 'Método não permitido.');
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
        jsonResponse('error', 'Token não fornecido.');
        exit;
    }

    $token = trim(str_replace('Bearer', '', $authHeader));
    $jwt = new JWTHandler();
    $decoded = $jwt->validateToken($token);

    if (!$decoded) {
        http_response_code(401);
        jsonResponse('error', 'Token inválido.');
        exit;
    }

    $userId = $decoded->user_id;

    // Deleta o usuário
    $stmt = $conn->prepare("DELETE FROM usuarios WHERE id_usuario = ?");
    $stmt->bind_param("i", $userId);

    if (!$stmt->execute()) {
        http_response_code(500);
        jsonResponse('error', 'Erro interno ao deletar usuário.');
        exit;
    }

    error_log("DELETE executado. Linhas afetadas: " . $stmt->affected_rows);

    if ($stmt->affected_rows > 0) {
        jsonResponse('success', 'Conta deletada com sucesso.');
        exit;
    } else {
        http_response_code(404);
        jsonResponse('error', 'Usuário não encontrado ou já deletado.');
        exit;
    }
?>