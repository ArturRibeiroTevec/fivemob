<?php
$clientID = '465d6acf88a53e4aa55d3be8fbff91b98cfad5f8';
$clientSecret = 'ab8e98dbc96cb2363db18b521b9588d6';
$user = 'teste-fiveimob@bol.com.br';
$password = 'teste123456';

$token = $_GET['token'];

use OlxApiClient\Client;
require '../vendor/autoload.php';
session_start();

$client = new Client('config.json');
$client->setConfig('state', $token);
if (isset($_SESSION['olx_access_token'])) {
    $dadosUsuario = $client->call('basic_user_info', json_encode(array(
        'access_token' => $_SESSION['olx_access_token']
    )));

    // var_dump(json_decode($dadosUsuario['body']));

    // save on database
    // TODO:
} else {
  header('Location:' . $client->createAuthUrl());
}
