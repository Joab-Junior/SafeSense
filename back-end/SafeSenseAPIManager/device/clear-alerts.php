<?php
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/../logs/php_errors.log'); // Não deixe de criar essa pasta e esse arquivo caso esteja rodando localmente e não tenha a pasta ainda!
    error_reporting(E_ALL);

    require_once __DIR__ . '/../config/database.php';
    require_once __DIR__ . '/../config/response.php';
    require_once __DIR__ . '/../config/headers.php';

    use Dotenv\Dotenv;

    // Carrega variáveis de ambiente
    $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();

    // Verifica se o método é POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        jsonResponse('error', 'Método não permitido');
        exit;
    }

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
        http_response_code(403);
        jsonResponse('error', 'Acesso negado: app secret inválido.');
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $id_usuario = $input['id_usuario'] ?? null;

    if (!$id_usuario) {
        jsonResponse('error', 'ID do usuário não fornecido');
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM alertas_gas WHERE id_usuario = ?");
    $stmt->bind_param('i', $id_usuario);
    
    if ($stmt->execute()) {
        jsonResponse('success', 'Alertas apagados com sucesso!');
    } else {
        jsonResponse('error', 'Erro ao apagar alertas');
    }
    $stmt->close();
    $conn->close();
?>