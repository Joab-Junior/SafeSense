<?php
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/../logs/php_errors.log'); // Não deixe de criar essa pasta e esse arquivo caso não tenha!
    error_reporting(E_ALL);

    include_once __DIR__ . '/../config/headers.php';
    include_once __DIR__ . '/../helper/jwtHandler.php';
    include_once __DIR__ . '/../config/response.php';

    use Dotenv\Dotenv;

    // Carrega variáveis de ambiente
    $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();

    // Captura os headers HTTP
    $headers = getallheaders();

    // Tenta pegar o segredo do header 'X-App-Secret'
    $appSecret = $headers['X-App-Secret'] ?? '';

    // Se não existir no header, tenta pegar do corpo JSON (opcional)
    if (!$appSecret) {
        $input = json_decode(file_get_contents('php://input'), true);
        $appSecret = $input['appSecret'] ?? '';
    }

    // Compara com o valor correto do .env
    $envSecret = $_ENV['APP_SECRET'] ?? null;

    // Valida o segredo
    if (!$envSecret || $appSecret !== $envSecret) {
        jsonResponse('error', 'Acesso negado: app secret inválido.', 403);
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        jsonResponse('error', 'Método não permitido. Use POST.');
        exit;
    }

    // Pega o token do header
    $authHeader = $headers['Authorization'] ?? '';

    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        jsonResponse('error', 'Token ausente ou inválido');
        exit;
    }

    $token = $matches[1];

    $jwt = new JWTHandler();

    try {
        // Usa a função que já criamos
        $decoded = $jwt->validateToken($token);

        // Gera um novo token com base nos dados decodificados
        $newToken = $jwt->generateToken($decoded->user_id, $decoded->email);

        jsonResponse("success", null, $newToken);

    } catch (Exception $e) {
        http_response_code(401);
        jsonResponse("error", "Token inválido ou expirado");
    }
    exit;
?>