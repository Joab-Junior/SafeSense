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

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(405);
        jsonResponse("error", "Método não permitido");
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

    if (!is_numeric($id_usuario)) {
        http_response_code(400);
        jsonResponse('error', 'ID do usuário é obrigatório e deve ser numérico');
        exit;
    }

    $stmt = $conn->prepare("SELECT id_alerta, dt_alerta, nivel_gas, st_alerta FROM alertas_gas WHERE id_usuario = ? ORDER BY dt_alerta DESC");

    if (!$stmt) {
        http_response_code(500);
        jsonResponse('error', 'Erro ao preparar a consulta');
        exit;
    }

    $stmt->bind_param('i', $id_usuario);
    $stmt->execute();
    $result = $stmt->get_result();
    $rows = $result->fetch_all(MYSQLI_ASSOC);

    // ✅ Conversão de UTC para horário de Brasília
    foreach ($rows as &$row) {
        if (isset($row['dt_alerta'])) {
            $utcDate = new DateTime($row['dt_alerta'], new DateTimeZone('UTC'));
            $utcDate->setTimezone(new DateTimeZone('America/Sao_Paulo'));
            $row['dt_alerta'] = $utcDate->format('Y-m-d H:i:s');
        }
    }

    if ($rows && count($rows) > 0) {
        jsonResponse('success', 'Alertas encontrados', $rows);
    } else {
        jsonResponse('success', 'Nenhum alerta encontrado', []);
    }
    exit;
?>