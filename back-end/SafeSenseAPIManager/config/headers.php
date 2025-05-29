<?php
require_once __DIR__ . '/../vendor/autoload.php';

$allowedOrigins = ['http://localhost:8100', 'capacitor://localhost', 'http://localhost', 'https://safesense-api-manager-development.up.railway.app'];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif (php_sapi_name() === 'cli-server') {
    // Se estiver rodando com o servidor embutido do PHP (dev)
    header("Access-Control-Allow-Origin: http://localhost:8100");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, x-app-secret");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Content-Length: 0");
    header("Content-Type: text/plain");
    http_response_code(204);
    exit;
}

header("Content-Type: application/json");

function getAllHeadersPortable(): array {
    $headers = [];

    foreach ($_SERVER as $name => $value) {
        if (str_starts_with($name, 'HTTP_')) {
            $key = strtolower(str_replace('_', '-', substr($name, 5)));
            $headers[$key] = $value;
        } elseif ($name === 'CONTENT_TYPE') {
            $headers['content-type'] = $value;
        } elseif ($name === 'CONTENT_LENGTH') {
            $headers['content-length'] = $value;
        } elseif ($name === 'CONTENT_MD5') {
            $headers['content-md5'] = $value;
        } elseif ($name === 'AUTHORIZATION') {
            $headers['authorization'] = $value;
        }
    }

    return $headers;
}
?>