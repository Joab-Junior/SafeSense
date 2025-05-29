<?php
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/../logs/php_errors.log');
    error_reporting(E_ALL);

    include_once __DIR__ . '/../config/headers.php';
    include_once __DIR__ . '/../config/database.php';
    include_once __DIR__ . '/../config/response.php';

    // Lê o JSON
    $input = json_decode(file_get_contents("php://input"), true);

    function validateStrongPassword($password) {
        return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/', $password);
    }

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(405);
        jsonResponse("error", "Método não permitido");
        exit;
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