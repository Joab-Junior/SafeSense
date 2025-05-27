<?php
include_once __DIR__ . '/./response.php';

$host = 'localhost';
$db = 'safesensedb';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    http_response_code(500);
    jsonResponse("error", "Erro na conexão com o banco.");
    exit;
}
?>