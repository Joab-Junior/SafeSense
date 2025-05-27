<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    include_once __DIR__ . '/../config/headers.php';
    include_once __DIR__ . '/../helper/jwtHandler.php';
    include_once __DIR__ . '/../config/response.php';

    // Pega o token do header
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        jsonResponse('error', 'Token ausente ou inválido');
        exit;
    }

    $token = $matches[1];

    try {
        // Usa a função que já criamos
        $decoded = validateToken($token);

        // Gera um novo token com base nos dados decodificados
        $newToken = generateToken($decoded->user_id, $decoded->email);

        jsonResponse("success", null, $newToken);

    } catch (Exception $e) {
        http_response_code(401);
        jsonResponse("error", "Token inválido ou expirado");
    }
    exit;
?>