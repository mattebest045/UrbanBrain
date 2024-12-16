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
    
    $stato_user = $_SESSION['user_Stato'];
    echo 'Stato: '.$stato_user;
    
    // Prima di reindirizzare alla pagina aggiungo nella tabella di log che l'utente si è loggato
    date_default_timezone_set("Europe/Rome"); // Imposta il fuso orario per l'Italia
    $dataAttuale = date("Y-m-d H:i:s", time()); // es output: 2024-12-14 15:20:34
    

    // Elenco di ruoli validi e relativi prefissi
    $validRoles = ['cittadino', 'superAdmin', 'operatore']; // Valori predefiniti accettabili
    $userRole = $_SESSION['user_role']; // Valore dinamico dall'utente

    if (in_array($userRole, $validRoles)) {
        // Costruzione sicura della query
        $tableName = $userRole;
        $columnName = 'ID' . ucfirst($userRole);

        $sql = "UPDATE $tableName 
                SET `Stato` = 3 
                WHERE $columnName = :id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
    } else {
        throw new Exception('Ruolo non valido!');
    }

    // Prima di reindirizzare alla pagina aggiungo nella tabella di log che l'utente si è loggato
    date_default_timezone_set("Europe/Rome"); // Imposta il fuso orario per l'Italia
    $dataAttuale = date("Y-m-d H:i:s", time()); // es output: 2024-12-14 15:20:34
    $sql = "INSERT INTO log (idUtente, `Data`, Descrizione) 
                VALUES (:id, :dataTempo, :descrizione)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':dataTempo' => $dataAttuale,
            ':descrizione' => 'Ha eliminato l`account'
        ]);
    
    session_unset();
    session_destroy();
    // Close connection
    unset($pdo);
    header('location: '.$location.'?successo='.urlencode('Hai eliminato il tuo account!'));
    exit();
}

?>