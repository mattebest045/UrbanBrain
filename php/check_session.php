<?php
session_start();

$response = [];

if (isset($_SESSION['user_id'])) { // Controlla se esiste una sessione
    $response['status'] = 'logged_in';

    // mi ricavo tutti i campi salvati in sessione
    foreach($_SESSION as $campo => $valore){
        $response[$campo] = htmlspecialchars($valore) ?? ''; 
    }
} else {
    $response['status'] = 'not_logged';
}

// Chiudi la sessione per liberare il blocco
session_write_close();

// Invia la risposta JSON
echo json_encode($response);
?>