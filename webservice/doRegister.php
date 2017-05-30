<?php
include_once "configurations.php";
include_once "helpers.php";
require_once "classes/User.class.php";

$name = $_POST['name'];
$sobrename = $_POST['sobrename'];
$email = $_POST['email'];
$password = $_POST['password'];
$admin = (isset($_POST['admin']) && $_POST['admin'] == 'yes') ? 1 : 0;

if (!$email || !$password) {
    echo json_encode(array(
        'status' => '0',
        'message' => 'Ops! Por favor, preencha todos os campos antes de continuar.',
    ));
}
else {
    $user = new User();
    $response = $user->doRegister($name, $email, $password, $admin);

    echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}
die;