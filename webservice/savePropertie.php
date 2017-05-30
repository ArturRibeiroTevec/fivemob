<?php
include_once "configurations.php";
include_once "helpers.php";
require_once "classes/Propertie.class.php";
require_once "classes/User.class.php";

$token = addslashes($_POST['token']);
$id_propertie = (isset($_POST['id_propertie']) && $_POST['id_propertie']) ? addslashes($_POST['id_propertie']) : null;

$userObj = new User();
$session = $userObj->getSession($token);

$propertieObj = new Propertie($id_propertie);
$propertieData = $_POST['propertie'];

// echo '<pre>';
// print_r($propertieData);
// echo '</pre>';
// die;

if ($propertieObj->save($propertieData, $session['id_user'])) {
    echo json_encode(array(
        'status' => '1',
    ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}
else {
    echo json_encode(array(
        'status' => '0',
    ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}
die;