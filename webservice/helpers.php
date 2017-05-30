<?php
// require_once 'vendor/autoload.php';

/**
 * VERIFY EMAIL
 * @param  string $email [description]
 * @return [type]        [description]
 */
function verifyEmail ($email = '') {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * CONVERT PARAMS TO DB
 * @param  [type] $params [description]
 * @return [type]         [description]
 */
function convertParamsToDB ($params) {
    $names = array(
        'id' => 'id_user',
        'firstName' => 'first_name',
        'lastName' => 'last_name',
    );

    // change keys
    foreach ($names as $fromAPI => $toDB) {
        if (isset($params[$fromAPI])) {
            $params[$toDB] = $params[$fromAPI];
            unset($params[$fromAPI]);
        }
    }

    // convert to PHP Date
    if (isset($params['birthdate'])) {
        $arrayBithdate = explode('/', $params['birthdate']);

        $params['birthdate'] = date('Y-m-d', strtotime($arrayBithdate[2] . '-' . $arrayBithdate[1] . '-' . $arrayBithdate[0]));
    }

    return $params;
}

/**
 * UTF8 ENCODE ARRAY
 * @param  array  $array [description]
 * @return [type]        [description]
 */
function utf8_encode_array ($array = array()) {
    $newArray = array();
    foreach ($array as $key => $value) {
        if (is_string($key)) {
            $key = utf8_encode($key);
        }

        if (!is_array($value)) {
            $newArray[$key] = utf8_encode($value);
        }
        else {
            $newArray[$key] = utf8_encode_array($value);
        }
    }

    return $newArray;
}