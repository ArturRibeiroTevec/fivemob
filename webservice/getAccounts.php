<?php
include_once "configurations.php";
include_once "helpers.php";
require_once "classes/User.class.php";

$token = $_POST['token'];

$userObject = new User();
$session = $userObject->getSession($token);

$response = array();

if ($session) {
  $response['status'] = '1';

  $response['accounts'] = $userObject->getAccounts($session['id_user']);
}
else {
  $response['status'] = '0';
}

echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
die;
