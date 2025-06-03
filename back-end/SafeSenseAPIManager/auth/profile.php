<?php
require_once __DIR__ . '/../config/headers.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helper/jwtHandler.php';
require_once __DIR__ . '/../config/response.php';

$headers = getallheaders();
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