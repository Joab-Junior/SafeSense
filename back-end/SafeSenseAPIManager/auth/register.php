<?php
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/../logs/php_errors.log'); // Não deixe de criar essa pasta e esse arquivo caso esteja rodando localmente e não tenha a pasta ainda!
    error_reporting(E_ALL);

    include_once __DIR__ . '/../config/headers.php';
    include_once __DIR__ . '/../config/database.php';
    include_once __DIR__ . '/../config/response.php';

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

    // Lê o JSON
    $input = json_decode(file_get_contents("php://input"), true);

    function validateStrongPassword($password) {
        return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/', $password);
    }

    $name = trim($input["name"] ?? '');
    $email = trim($input["email"] ?? '');
    $password = $input["password"] ?? '';

    if (empty($name) || empty($email) || empty($password)) {
        http_response_code(400);
        jsonResponse("error", "E-mail e senha são obrigatórios.");
        exit;
    }

    // Validação básica
    if (strlen($name) < 2) {
        jsonResponse("error", "Nome muito curto.");
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse("error", "Email inválido.");
        exit;
    }
    if (!validateStrongPassword($password)) {
        jsonResponse("error", "A senha deve ter no mínimo 6 caracteres, com letras maiúsculas, minúsculas, números e símbolos.");
        exit;
    }


    // Verifica se o e-mail já existe
    $check = $conn->prepare("SELECT id_usuario FROM usuarios WHERE em_usuario = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        jsonResponse("error", "E-mail já cadastrado.");
        exit;
    }
    $check->close();

    // Hash da senha
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Inserção segura
    $stmt = $conn->prepare("INSERT INTO usuarios (nm_usuario, em_usuario, senha) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $passwordHash);

    if ($stmt->execute()) {
        jsonResponse("success", "Conta criada com sucesso.");
    } else {
        jsonResponse("error", "Erro ao criar conta.");
    }

    $stmt->close();
    exit;
?>