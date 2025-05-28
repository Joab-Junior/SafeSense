<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php_errors.log');
error_reporting(E_ALL);

require_once __DIR__ . '/../config/headers.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helper/jwtHandler.php';
require_once __DIR__ . '/../config/response.php';

// Verifica se o método é DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    jsonResponse('error', 'Método não permitido.', 405);
    exit;
}

// Lê os headers para pegar o Authorization
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
    jsonResponse('error', 'Token não fornecido.', 401);
    exit;
}

$token = trim(str_replace('Bearer', '', $authHeader));
$jwt = new JWTHandler();
$decoded = $jwt->validateToken($token);

if (!$decoded) {
    jsonResponse('error', 'Token inválido.', 401);
    exit;
}

$userId = $decoded->user_id;

// Deleta o usuário
$stmt = $conn->prepare("DELETE FROM usuarios WHERE id_usuario = ?");
$stmt->bind_param("i", $userId);

if ($stmt->execute()) {
    jsonResponse('success', 'Conta deletada com sucesso.');
} else {
    jsonResponse('error', 'Erro ao deletar conta.', 500);
}
?>