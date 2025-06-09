<?php
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/../logs/php_errors.log'); // Não deixe de criar essa pasta e esse arquivo caso esteja rodando localmente e não tenha a pasta ainda!
    error_reporting(E_ALL);

    require_once __DIR__ . '/../config/headers.php';
    require_once __DIR__ . '/../config/database.php';
    require_once __DIR__ . '/../config/response.php';

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

    // Lê o corpo da requisição JSON
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    // Verifica se o JSON é válido
    if (!is_array($input)) {
        http_response_code(400);
        jsonResponse('error', 'JSON inválido');
        exit;
    }

    // Extrai os dados com segurança
    $id_usuario = $input['id_usuario'] ?? null;
    $id_dispositivo = $input['id_dispositivo'] ?? null;
    $nivel_gas = $input['nivel_gas'] ?? null;
    $st_alerta = $input['st_alerta'] ?? null;

    // Validação simples
    if (!$id_usuario || !$id_dispositivo || !$nivel_gas || !$st_alerta) {
        http_response_code(400);
        jsonResponse('error', 'Dados incompletos');
        exit;
    }

    // Prepara e executa a query com prepared statement (evita SQL Injection)
    $stmt = $conn->prepare("
        INSERT INTO alertas_gas (id_usuario, id_dispositivo, nivel_gas, st_alerta)
        VALUES (?, ?, ?, ?)
    ");

    if (!$stmt) {
        http_response_code(500);
        jsonResponse('error', 'Erro na preparação da query');
        exit;
    }

    $stmt->bind_param('iiss', $id_usuario, $id_dispositivo, $nivel_gas, $st_alerta);

    if ($stmt->execute()) {
        jsonResponse('success', 'Alerta registrado com sucesso');
    } else {
        http_response_code(500);
        jsonResponse('error', 'Erro ao inserir no banco: ' . $stmt->error);
    }

    $stmt->close();
    $conn->close();
    exit;
?>