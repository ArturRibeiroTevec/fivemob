<?php
include_once "configurations.php";
include_once "helpers.php";
require_once "classes/User.class.php";

$params = $_POST;

if ($params) {
    $params = convertParamsToDB($params);

    $user = new User();
    $response = $user->update($params);

    echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}
else {
    echo json_encode(array(
        'status' => '0',
        'message' => 'Ops! Ocorreu um erro com o envio de dados. Por favor, tente novamente.'
    ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}