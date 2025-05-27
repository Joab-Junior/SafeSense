<?php
$allowedOrigins = ['http://localhost:8100', 'capacitor://localhost', 'http://localhost'];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization");
    header("Access-Control-Allow-Credentials: true");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");
?>