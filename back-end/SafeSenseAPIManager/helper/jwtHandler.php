<?php
require __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/response.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

class JWTHandler {
    private $key;

    public function __construct() {
        // Carrega variáveis de ambiente se ainda não carregadas
        if (!isset($_ENV['JWT_SECRET']) && !isset($_SERVER['JWT_SECRET'])) {
            $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
            $dotenv->load();
        }

        $this->key = $_ENV['JWT_SECRET'] ?? $_SERVER['JWT_SECRET'] ?? null;

        if (!$this->key) {
            http_response_code(500);
            jsonResponse("error", "Chave secreta JWT não definida.");
            exit;
        }
    }

    /**
     * Gera um token JWT
     */
    public function generateToken($userId, $email) {
        $payload = [
            'user_id' => $userId,
            'email'   => $email,
            'exp'     => time() + 60 * 60 * 4 // expira em 4 horas
        ];

        return JWT::encode($payload, $this->key, 'HS256');
    }

    /**
     * Valida um token JWT e retorna os dados decodificados
     */
    public function validateToken($token) {
        return JWT::decode($token, new Key($this->key, 'HS256'));
    }
}
?>