<?php
require_once __DIR__ . '/response.php';
use Dotenv\Dotenv;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$host   = $_ENV['DB_HOST']     ?? '';
$port   = $_ENV['DB_PORT']     ?? '';
$user   = $_ENV['DB_USER']     ?? '';
$pass   = $_ENV['DB_PASSWORD'] ?? '';
$dbname = $_ENV['DB_NAME']     ?? '';

if (!$host || !$port || !$user || !$pass || !$dbname) {
    http_response_code(500);
    jsonResponse("error", "Variáveis de ambiente do banco de dados não estão definidas corretamente.");
    exit;
}

// Conexão com SSL (Aiven exige)
$conn = new mysqli($host, $user, $pass, $dbname, $port);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    http_response_code(500);
    jsonResponse("error", "Erro na conexão com o banco: " . $conn->connect_error);
    exit;
}
?>