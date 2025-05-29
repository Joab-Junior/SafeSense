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
$headers = getAllHeadersPortable();
$authHeader = $headers['authorization'] ?? '';

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
$stmt->execute();

if ($stmt->affected_rows > 0) {
    jsonResponse('success', 'Conta deletada com sucesso.');
    exit;
} else {
    jsonResponse('error', 'Usuário não encontrado ou já deletado.', 404);
    exit;
}

/* $stmt = $conn->prepare("SELECT * FROM usuarios WHERE id_usuario = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $userData = $result->fetch_assoc();
    jsonResponse('success', 'Dados do usuário antes da exclusão:', $userData);
} else {
    jsonResponse('error', 'Usuário não encontrado.', 404);
    exit;
} */
?>