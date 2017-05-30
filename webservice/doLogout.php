<?php
include_once "configurations.php";
include_once "helpers.php";
require_once "classes/User.class.php";

$token = $_POST['token'];

$user = new User();
$response = $user->doLogout($token);