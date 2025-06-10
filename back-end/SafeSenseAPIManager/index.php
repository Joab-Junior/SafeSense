<?php
require_once __DIR__ . '/config/headers.php';
include_once __DIR__ . '/config/response.php';

use Dotenv\Dotenv;

// Carrega variáveis de ambiente
$dotenv = Dotenv::createImmutable(__DIR__ . '/./');
$dotenv->load();

// Captura os headers HTTP
$headers = getallheaders();

// Tenta pegar o segredo do header 'X-App-Secret'
$appSecret = $headers['X-App-Secret'] ?? '';

// Se não existir no header, tenta pegar do corpo JSON
if (!$appSecret) {
    $input = json_decode(file_get_contents('php://input'), true);
    $appSecret = $input['appSecret'] ?? '';
}

// Compara com o valor correto do .env
$envSecret = $_ENV['APP_SECRET'] ?? null;

// Valida o segredo
if (!$envSecret || $appSecret !== $envSecret) {
    jsonResponse('error', 'Acesso negado: app secret inválido.', 403);
}

// Roteamento
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

switch ($uri) {
    case '/auth/delete-account.php':
        if ($method === 'DELETE') {
            require __DIR__ . '/auth/delete-account.php';
        } else {
            http_response_code(405);
            jsonResponse('error', 'Método não permitido.');
        }
    break;

    case '/auth/login.php':
        require __DIR__ . '/auth/login.php';
    break;

    case '/auth/register.php':
        require __DIR__ . '/auth/register.php';
    break;

    case '/auth/refresh-token.php':
        require __DIR__ . '/auth/refresh-token.php';
    break;

    case '/auth/profile.php':
        require __DIR__ . '/auth/profile.php';
    break;

    case '/auth/change-password.php':
        require __DIR__ . '/auth/change-password.php';
    break;

    case '/device/register-alert.php':
        require __DIR__ . '/device/register-alert.php';
    break;

    case '/device/last-alert.php':
        require __DIR__ . '/device/last-alert.php';
    break;

    case '/device/list-alerts.php':
        require __DIR__ . '/device/list-alerts.php';
    break;

    case '/device/clear-alerts.php':
        require __DIR__ . '/device/clear-alerts.php';
    break;

    default:
        http_response_code(404);
        jsonResponse('error', 'Rota não encontrada.');
    break;
}