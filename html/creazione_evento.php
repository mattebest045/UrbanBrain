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
$_SESSION['user_role'] = 'operatore';
echo $_SESSION['user_role'];
if(empty($_SESSION)){
    die("Qualcuno qua sta provando a fare il furbo eh");
}else if(isset($_SESSION['user_role'])){
    if($_SESSION['user_role'] != 'operatore'){
        die("Che ci fai qua? PERMESSO VIETATO!!!");
    }
}

$Nome = $_GET['creazione_evento_nome'] ?? '';
$Luogo = $_GET['creazione_evento_luogo'] ?? '';
$Data = $_GET['creazione_evento_data'] ?? '';
$Descrizione = $_GET['creazione_evento_descrizione'] ?? '';
$evento_online = (isset($_GET['creazione_evento_online'])) ? true : false; // Per star sicuro lo metto così. Non odiarmi per questo ahahah
$NPosti = ($evento_online) ? -1 : $_GET['creazione_evento_nPosti'];
echo "Nome: ".$Nome.
     "Luogo: ".$Luogo.
     "Data: ".$Data.
     "Descrizione: ".$Descrizione.
     "evento online: ".($evento_online ? 'SI': 'NO').
     "NPOSTI: ".$NPosti."<br>";
if(!$evento_online){
    // Controllo se esiste la città nel database, altrimenti la aggiungo
    $Citta = estraiCitta($Luogo);

    try{
        $sql = "SELECT 1 AS RISP
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
            
        }
    }catch(PDOException $e){
        die("ERROR: Could not able to execute $sql." . $e->getMessage());
    }
}else{
    echo "ESPOLIDI";
}


// echo"<br>Nome: ".$Nome.
//     ", Luogo: ".$Luogo.
//     ", Online? ".(($evento_online) ? 'SI' : 'NO').
//     ", NPosti: ".$NPosti.
//     ", Descrizione: ".$Descrizione.
//     ", Data: ".$Data."<br>";
// die();
try{
    $sql = "INSERT INTO evento (Nome, Luogo, NPosti, Descrizione, `Data`, Stato) 
        VALUES (:nome, :luogo, :nPosti, :descrizione, :data, :stato)";

    $stmt = $pdo->prepare($sql);

    $params = [
        ':nome' => ucfirst(str_replace("'", "`", $Nome)),
        ':luogo' => str_replace("'", "`", $Luogo),
        ':nPosti' => $NPosti,
        ':descrizione' => str_replace("'", "`", $Descrizione),
        ':data' => $Data,
        ':stato' => 2
    ];
    var_dump($params);
    if ($stmt->execute($params)) {
        // Close connection
        unset($pdo);
        header('location: event.php?successo=Creazione dell`evento avvenuta con successo!');
    } else {
        // Close connection
        unset($pdo);
        header('location: event.php?errore=Errore nell`inserimento dell`evento');
    }

}catch(PDOException $e){
    die("ERROR: Could not able to execute $sql." . $e->getMessage());
}

?>