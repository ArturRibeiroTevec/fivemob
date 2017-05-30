<?php
include_once "configurations.php";
include_once "helpers.php";
require_once "classes/User.class.php";

$userObject = new User();

$response = array();

$response['status'] = '1';

$response['realtors'] = $userObject->getAll();

echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);