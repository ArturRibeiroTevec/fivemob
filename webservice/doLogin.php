<?php
include_once "configurations.php";
include_once "helpers.php";
require_once "classes/User.class.php";

$email = $_POST['email'];
$password = $_POST['password'];

if (!$email || !$password) {
    echo json_encode(array(
        'status' => '0',
        'message' => 'Ops! Por favor, preencha todos os campos antes de continuar.',
    ));
}
else {
    $user = new User();
    $response = $user->doLogin($email, $password);

    echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}