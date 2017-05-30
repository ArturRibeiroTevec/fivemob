<?php
include_once "configurations.php";
include_once "helpers.php";
require_once "classes/User.class.php";

$token = addslashes($_POST['token']);
$id_user = (isset($_POST['id_user']) && $_POST['id_user']) ? addslashes($_POST['id_user']) : null;

$userObj = new User();
$session = $userObj->getSession($token);
if ($userObj->is_admin($session['id_user'])) {
    $userData = $_POST['user'];

    $response = array();
    if (!$id_user) {
        // REGISTER
        $response = $userObj->doRegister($userData['name'], $userData['email'], $userData['password'], $userData['admin'], $userData['realtor']);
    }
    else {
        // UPDATE
        $response = $userObj->update($id_user, $userData['name'], $userData['email'], (($userData['password']) ? $userData['password'] : ''), $userData['admin'], $userData['realtor']);
    }

    echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}
else {
    echo json_encode(array(
        'status' => '0',
        'message' => 'Você não possui permissão para executar esta ação. Por favor, contate seu administrador.',
    ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}    
die;