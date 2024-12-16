<?php

session_start();
$location = "http://localhost/UrbanBrain/"; 
include("connessione_db.php");
$id = $_SESSION['user_id'];

// Logout
if(isset($_POST['logoutButton'])){
    session_unset();
    session_destroy();
    // Prima di reindirizzare alla pagina aggiungo nella tabella di log che l'utente si è loggato
    date_default_timezone_set("Europe/Rome"); // Imposta il fuso orario per l'Italia
    $dataAttuale = date("Y-m-d H:i:s", time()); // es output: 2024-12-14 15:20:34
    
    echo 'id: '.$id.', data: '.$dataAttuale;
    try{
        $sql = "INSERT INTO log (idUtente, `Data`, Descrizione) 
                VALUES (:id, :dataTempo, :descrizione)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':dataTempo' => $dataAttuale,
            ':descrizione' => 'Ha effettuato il logout'
        ]);
        
        // Close connection
        unset($pdo);
        header('location: '.$location.'?successo='.urlencode('Logout avvenuto con successo'));
        exit();
    }catch(PDOException $e){
        echo "ERROR: Could not able to execute $sql." . $e->getMessage();
        $output = 'errore='.urlencode("ERRORE: qualcosa è andato storto...");
        header('location: '.$location.'?'.$output);
        exit();
    }
}


// Eliminazione account

if(isset($_POST['deleteAccountButton'])){
    
}

?>