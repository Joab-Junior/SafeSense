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

    $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(405);
        jsonResponse("error", "Método não permitido");
        exit;
    }

    $headers = getallheaders();
    $appSecret = $headers['X-App-Secret'] ?? '';
    if (!$appSecret) {
        $input = json_decode(file_get_contents('php://input'), true);
        $appSecret = $input['appSecret'] ?? '';
    }
    $envSecret = $_ENV['APP_SECRET'] ?? null;
    if (!$envSecret || $appSecret !== $envSecret) {
        http_response_code(403);
        jsonResponse('error', 'Acesso negado: app secret inválido.');
        exit;
    }

    $authHeader = $headers['Authorization'] ?? '';
    if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
        http_response_code(401);
        jsonResponse("error", "Token ausente ou formato inválido.");
        exit;
    }

    $token = trim(str_replace('Bearer ', '', $authHeader));
    $userId = validateToken($token);
    if (!$userId) {
        http_response_code(401);
        jsonResponse("error", "Token inválido ou expirado.");
        exit;
    }

    // Lê o JSON
    $input = json_decode(file_get_contents("php://input"), true);
    $currentPassword = $input["currentPassword"] ?? '';
    $newPassword = $input["newPassword"] ?? '';

    if (!$currentPassword || !$newPassword) {
        http_response_code(400);
        jsonResponse("error", "Preencha todos os campos.");
        exit;
    }

    function validateStrongPassword($password) {
        return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/', $password);
    }

    if (!validateStrongPassword($newPassword)) {
        http_response_code(400);
        jsonResponse("error", "A nova senha deve conter letras maiúsculas, minúsculas, números e símbolos (mín. 6 caracteres).");
        exit;
    }

    // Busca a senha atual no banco
    $query = $conn->prepare("SELECT senha FROM usuarios WHERE id_usuario = ?");
    $query->bind_param("i", $userId);
    $query->execute();
    $query->store_result();

    if ($query->num_rows === 0) {
        jsonResponse("error", "Usuário não encontrado.");
        exit;
    }

    $query->bind_result($storedPasswordHash);
    $query->fetch();

    if (!password_verify($currentPassword, $storedPasswordHash)) {
        jsonResponse("error", "Senha atual incorreta.");
        exit;
    }

    // Atualiza a senha
    $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
    $update = $conn->prepare("UPDATE usuarios SET senha = ? WHERE id_usuario = ?");
    $update->bind_param("si", $newPasswordHash, $userId);

    if ($update->execute()) {
        jsonResponse("success", "Senha alterada com sucesso.");
    } else {
        jsonResponse("error", "Erro ao atualizar senha.");
    }

    exit;
?>