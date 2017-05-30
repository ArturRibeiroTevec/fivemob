<?php
include_once "configurations.php";
include_once "helpers.php";
require_once "classes/Propertie.class.php";

$token = addslashes($_POST['token']);
$id_propertie = $_POST['id_propertie'];

$propertieObj = new Propertie($id_propertie);

if ($propertieObj->remove()) {
    echo json_encode(array(
        'status' => '1',
    ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}
else {
    echo json_encode(array(
        'status' => '0',
        'message' => 'Ops! Ocorreu um erro na hora de deletar este imóvel. Por favor, tente novamente. Caso o erro persista, entre em contato com nosso suporte.',
    ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}
die;