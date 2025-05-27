<?php
require __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/response.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

// Carrega variáveis de ambiente uma única vez
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Define a chave secreta globalmente
$key = $_ENV['JWT_SECRET'] ?? $_SERVER['JWT_SECRET'] ?? null;

if (!$key) {
    http_response_code(500);
    jsonResponse("error", "Chave secreta JWT não definida.");
    exit;
}

/**
 * Gera um token JWT
 */
function generateToken($userId, $email) {
    global $key;

    $payload = [
        'user_id' => $userId,
        'email' => $email,
        'exp' => time() + 60 * 60 * 4
    ];

    return JWT::encode($payload, $key, 'HS256');
}

/**
 * Valida um token JWT e retorna os dados decodificados
 */
function validateToken($token) {
    global $key;

    return JWT::decode($token, new Key($key, 'HS256'));
}
?>