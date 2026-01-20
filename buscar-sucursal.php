<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$input = json_decode(file_get_contents('php://input'), true);
$direccion = strtolower($input['direccion']);

$sucursales = json_decode(file_get_contents('sucursales.json'), true);

foreach ($sucursales as $sucursal) {
    foreach ($sucursal['fraccionamientos'] as $frac) {
        if (strpos(strtolower($frac), $direccion) !== false) {
            echo json_encode($sucursal);
            exit;
        }
    }
}

http_response_code(404);
echo json_encode(['message' => 'No encontramos una sucursal para esa zona']);
?>