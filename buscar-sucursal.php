<?php
// Configurar headers para CORS y JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Método no permitido']);
    exit;
}

// Leer input JSON
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['direccion']) || empty(trim($input['direccion']))) {
    http_response_code(400);
    echo json_encode(['message' => 'Dirección requerida']);
    exit;
}

// Cargar sucursales desde JSON
if (!file_exists('sucursales.json')) {
    http_response_code(500);
    echo json_encode(['message' => 'Archivo de datos no encontrado']);
    exit;
}

$sucursalesJson = file_get_contents('sucursales.json');
if ($sucursalesJson === false) {
    http_response_code(500);
    echo json_encode(['message' => 'Error cargando datos']);
    exit;
}

$sucursales = json_decode($sucursalesJson, true);
if ($sucursales === null) {
    http_response_code(500);
    echo json_encode(['message' => 'Error procesando datos']);
    exit;
}

// Función para normalizar texto
function normalizar($texto) {
    $texto = strtolower($texto);
    // Remover acentos
    $texto = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $texto);
    // Remover caracteres especiales
    $texto = preg_replace('/[^a-z0-9\s]/', '', $texto);
    return trim($texto);
}

$direccion = normalizar($input['direccion']);
$sucursalEncontrada = null;

// Buscar en todas las sucursales
foreach ($sucursales as $sucursal) {
    if (isset($sucursal['fraccionamientos']) && is_array($sucursal['fraccionamientos'])) {
        foreach ($sucursal['fraccionamientos'] as $fraccionamiento) {
            $fracNormalizado = normalizar($fraccionamiento);
            // Búsqueda bidireccional
            if (strpos($fracNormalizado, $direccion) !== false || strpos($direccion, $fracNormalizado) !== false) {
                $sucursalEncontrada = $sucursal;
                break 2; // Salir de ambos loops
            }
        }
    }
}

if ($sucursalEncontrada === null) {
    http_response_code(404);
    echo json_encode(['message' => 'No encontramos una sucursal para esa zona']);
    exit;
}

// Respuesta exitosa
echo json_encode([
    'nombre' => $sucursalEncontrada['nombre'] ?? 'Sin nombre',
    'telefono' => $sucursalEncontrada['telefono'] ?? 'Sin teléfono',
    'whatsapp' => $sucursalEncontrada['whatsapp'] ?? 'Sin WhatsApp',
    'fraccionamientos' => $sucursalEncontrada['fraccionamientos'] ?? []
]);
?>