<?php
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/../logs/php_errors.log'); // Não deixe de criar essa pasta e esse arquivo caso não tenha!
    error_reporting(E_ALL);

    require_once __DIR__ . '/../config/headers.php';
    require_once __DIR__ . '/../config/database.php';
    require_once __DIR__ . '/../helper/jwtHandler.php';
    require_once __DIR__ . '/../config/response.php';

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

    // Verifica se o método é DELETE
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        jsonResponse('error', 'Método não permitido.', 405);
        exit;
    }

    $authHeader = $headers['Authorization'] ?? '';

    if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
        error_log("Token não fornecido corretamente");
        jsonResponse('error', 'Token não fornecido.', 401);
        exit;
    }

    $token = trim(str_replace('Bearer', '', $authHeader));
    $jwt = new JWTHandler();
    $decoded = $jwt->validateToken($token);

    if (!$decoded) {
        error_log("Token inválido");
        jsonResponse('error', 'Token inválido.', 401);
        exit;
    }

    $userId = $decoded->user_id;
    error_log("ID do usuário extraído do token: " . $userId);

    // Deleta o usuário
    $stmt = $conn->prepare("DELETE FROM usuarios WHERE id_usuario = ?");
    $stmt->bind_param("i", $userId);

    if (!$stmt->execute()) {
        error_log("Erro ao executar DELETE: " . $stmt->error);
        jsonResponse('error', 'Erro interno ao deletar usuário.', 500);
        exit;
    }

    error_log("DELETE executado. Linhas afetadas: " . $stmt->affected_rows);

    if ($stmt->affected_rows > 0) {
        jsonResponse('success', 'Conta deletada com sucesso.');
        exit;
    } else {
        jsonResponse('error', 'Usuário não encontrado ou já deletado.', 404);
        exit;
    }
?>