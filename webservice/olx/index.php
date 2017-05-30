<?php
$clientID = '465d6acf88a53e4aa55d3be8fbff91b98cfad5f8';
$clientSecret = 'ab8e98dbc96cb2363db18b521b9588d6';
$user = 'teste-fiveimob@bol.com.br';
$password = 'teste123456';

use OlxApiClient\Client;
require '../vendor/autoload.php';
session_start();

$client = new Client('config.json');

if (!isset($_GET['code'])) {
    echo '<a href = '.$client->createAuthUrl().'>Autentica</a>';
} else {
    $_SESSION['olx_access_token'] = $client->authenticate($_GET['code']);
    header('Location: http://'.$_SERVER['HTTP_HOST'].'/');
}
