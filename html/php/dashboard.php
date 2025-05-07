<?php
header('Content-Type: application/json');

// Esempio di dati dei sensori
$sensors = array(
    "labels" => ["Gennaio", "Febbraio", "Marzo", "Aprile"],
    "temperature" => [22, 19, 23, 21],
    "humidity" => [60, 55, 70, 65],
    "light" => [300, 320, 310, 330],
    "pressure" => [1012, 1015, 1013, 1011],
    "airQuality" => [50, 55, 45, 60],
    "noise" => [70, 65, 80, 75],
    "co2" => [400, 420, 430, 410],
    "windSpeed" => [10, 15, 12, 14],
    "windDirection" => [180, 175, 190, 185],
    "rainfall" => [100, 110, 120, 90],
    "waterLevel" => [2, 2.5, 3, 2.8],
    "uvRadiation" => [5, 6, 7, 8],
    "energyConsumption" => [200, 210, 190, 205],
    "pm25" => [30, 25, 35, 28],
    "pm10" => [40, 45, 38, 42],
    "fireDetection" => [0, 0, 1, 0],
    "gasDetection" => [0, 1, 0, 0],
    "vibrations" => [2, 3, 1, 2],
    "publicLighting" => [80, 85, 90, 82]
    // Aggiungi ulteriori dati per gli altri sensori qui
);

$json_data = json_encode($sensors);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["error" => "Errore nella codifica JSON: " . json_last_error_msg()]);
} else {
    echo $json_data;
}

// Debug: stampa l'output JSON per il debug
// error_log(print_r($json_data, true));
?>
