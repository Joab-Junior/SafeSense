<?php
include_once __DIR__ . '/headers.php';

function jsonResponse($status, $message, $data = null) {
    echo json_encode(array_filter([
        "status" => $status,
        "message" => $message,
        "data" => $data
    ]));
    exit;
}
?>