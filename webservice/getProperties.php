<?php
include_once "configurations.php";
include_once "helpers.php";
require_once "classes/Propertie.class.php";

$page = (int) $_POST['page'];

$propertieObject = new Propertie();

$response = array();

$response['status'] = '1';

$response['properties'] = $propertieObject->getAll($page);

echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);