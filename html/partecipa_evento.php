<?php
function estraiCitta($indirizzo) {
    // Cerca il primo numero a 4-6 cifre che potrebbe rappresentare un CAP
    if (preg_match('/\d{4,6}\s+([^,]+)/', $indirizzo, $matches)) {
        return trim($matches[1]); // La città è immediatamente dopo il CAP
    }
    
    // Se non c'è CAP, cerca dopo una virgola
    if (strpos($indirizzo, ',') !== false) {
        $parts = explode(',', $indirizzo);
        return trim(end($parts)); // Prendi l'ultima parte dell'indirizzo
    }

    // Default: restituisci l'indirizzo intero se non riesce a trovare la città
    return $indirizzo;
}



session_start();
include("connessione_db.php");
// $_SESSION['user_role'] = 'operatore';
// echo $_SESSION['user_role'];
if(empty($_SESSION)){
    die("Qualcuno qua sta provando a fare il furbo eh");
}else if(isset($_SESSION['user_role'])){
    if(($_SESSION['user_role'] != 'cittadino') && ($_SESSION['user_role'] != 'operatore')){
        die("Che ci fai qua? PERMESSO VIETATO!!!");
    }
}

$id_evento = $_POST['event_id'] ?? '';
$id_user = $_SESSION['user_id'];
$Luogo = ($nPosti != -1) ? estraicitta($_POST['event_luogo']) : $_POST['event_luogo'];
// CONTROLLA SE LA CITTA IN QUESTIONE SI PUO COLLEGARE AD UNA CITTA DENTRO AL NOSTRO DATABASE
$citta = estraiCitta($Luogo);

$Data = date("Y/m/d"); // Data in cui viene effettuata la registrazione all'evento
$Segnalazione = $_POST['event_segnalazione'] ?? '';

try{
    while(true){
        $sql = "SELECT citta.IDCitta AS ID
                FROM citta
                WHERE citta.Nome = :citta;";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':citta' => $Citta]);
        $queryResult = $stmt->fetch(PDO::FETCH_ASSOC);
        if(empty($queryResult)){ // NON HO LA CITTA NEL DB
            $sql = "INSERT INTO `citta`(`Nome`, `Regione`) 
                    VALUES (:nome, :regione);";
            $stmt = $pdo->prepare($sql);
            $params = [
                ':nome' => ucfirst(str_replace("'", "`", $Citta)),
                ':regione' => 'MODIFICA DA ADMIN'
            ];

            if (!($stmt->execute($params))){
                // Close connection
                unset($pdo);
                header('location: event.php?errore=Errore nell`inserimento dell`evento');
            }else{
                echo "BELLALAAA";
            }    
        }else{
            $id_citta = $queryResult['ID'];
        }
        break;
    }

    echo $id_citta;
    die();
}catch(PDOException $e){
    die("ERROR: Could not able to execute $sql." . $e->getMessage());
}


// try{
//     "INSERT INTO partecipazione (idCitta, idEvento, idCittadino, DataPartecipazione, Segnalazione) ".
//     "VALUES ('{idCitta}', '{idEvento}', '{idCittadino}', '{DataPartecipazione}', '{Segnalazione}');"
// }catch(PDOException $e){
//     die("ERROR: Could not able to execute $sql." . $e->getMessage());
// }
?>