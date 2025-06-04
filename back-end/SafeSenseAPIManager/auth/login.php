<?php
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/../logs/php_errors.log'); // Não deixe de criar essa pasta e esse arquivo caso não tenha!
    error_reporting(E_ALL);

    include_once __DIR__ . '/../config/headers.php';
    include_once __DIR__ . '/../config/database.php';
    include_once __DIR__ . '/../helper/jwtHandler.php';
    include_once __DIR__ . '/../config/response.php';

    use Dotenv\Dotenv;

    // Carrega variáveis de ambiente
    $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();

    // Captura os headers HTTP
    $headers = getallheaders();

    // Tenta pegar o segredo do header 'X-App-Secret'
    $appSecret = $headers['X-App-Secret'] ?? '';

    // Se não existir no header, tenta pegar do corpo JSON (opcional)
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

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(405);
        jsonResponse("error", "Método não permitido");
        exit;
    }

    $input = json_decode(file_get_contents("php://input"), true);
    $email = trim($input["email"] ?? '');
    $password = trim($input["password"] ?? '');

    if (empty($email) || empty($password)) {
        http_response_code(400);
        jsonResponse("error", "E-mail e senha são obrigatórios.");
        exit;
    }

    // Verifica se o usuário existe
    $stmt = $conn->prepare("SELECT id_usuario, senha FROM usuarios WHERE em_usuario = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 0) {
        http_response_code(404);
        jsonResponse("error", "Usuário não encontrado");
        exit;
    }

    $stmt->bind_result($id_usuario, $passwordHash);
    $stmt->fetch();

    if (!password_verify($password, $passwordHash)) {
        http_response_code(401);
        jsonResponse("error", "Senha incorreta");
        exit;
    }
    $stmt->close();
    
    $jwt = new JWTHandler();

    // Gera token JWT
    $token = $jwt->generateToken($id_usuario, $email);

    jsonResponse(
        "success",
        null,
        $token
    );
    exit;
?>