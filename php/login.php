<?php
include("connessione_db.php");

function getUserDataByPermission($queryResult, $permesso) {
    // Controlla quante tuple sono presenti
    $tupleCount = count($queryResult);
    // Mappa per i permessi in base al numero di tuple
    echo "<br>".$permesso."<br>";
    if($permesso === "superAdmin"){
        echo "<br>BELLA<br>";
        $permessiMap = [
        1 => ['cittadino'], // Se c'è solo una tupla, è un cittadino
        2 => ['cittadino', 'superAdmin'], // Due tuple: cittadino e operatore/admin
        3 => ['cittadino', 'superAdmin', 'operatore'] // Tre tuple: tutti i permessi
    ];
    }else{
        $permessiMap = [
            1 => ['cittadino'], // Se c'è solo una tupla, è un cittadino
            2 => ['cittadino', 'operatore'], // Due tuple: cittadino e operatore/admin
            3 => ['cittadino', 'operatore', 'superAdmin'] // Tre tuple: tutti i permessi
        ];
    }
    

    // Controlla se il numero di tuple ha una corrispondenza
    if (!array_key_exists($tupleCount, $permessiMap)) {
        throw new Exception("Numero di tuple inaspettato: $tupleCount");
    }

    // Trova la posizione del permesso richiesto nell'elenco
    $permessi = $permessiMap[$tupleCount];
    $index = array_search($permesso, $permessi);

    // Controlla se il permesso esiste tra quelli disponibili
    if ($index === false) {
        throw new Exception("Permesso '$permesso' non trovato tra quelli disponibili per $tupleCount tuple.");
    }

    // Controlla se esiste una tupla corrispondente all'indice calcolato
    if (!isset($queryResult[$index])) {
        throw new Exception("Nessuna tupla trovata per il permesso: $permesso");
    }

    // Ritorna la tupla corrispondente
    return $queryResult[$index];
}

function verificaPassword($id, $psw, $permesso) {
    global $pdo, $location;
    // Lista dei permessi validi
    $permessiValidi = ['cittadino', 'superAdmin', 'operatore'];
    echo "FUNCTION: ".$id.", ".$permesso.", ".$psw."<br>";
    // Controllo che il permesso sia valido
    if (!in_array($permesso, $permessiValidi)) {
        $output = 'errore='.urlencode("Errore: Permesso non valido.");
        header('location: '.$location.'?'.$output);
    }
    
    try{
        // Costruzione della query
        $sql = "SELECT 1 AS STM
                FROM $permesso 
                WHERE ID" . ucfirst($permesso) . " = :id 
                  AND Password = :psw";
                  
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':psw' => $psw, 
        ]);
      
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $ris = '';
        if($result){
            $ris = $result['STM'];
        }
        var_dump($ris);
        // PASSWORD CORRETTA
        if($ris){
            echo "<br>PSW CORRETTAAAA<br>";
            
            // Attivo la session
            session_start();
            $_SESSION['user_id'] = $id;
            $_SESSION['user_role'] = $permesso;

            // Ricavo anche info utili come Nome, Cognome, Indirizzo, Email
            // operatore -> Tipo, Ruolo, Email_operatore (potrei sovrascrivere il campo email)
            // superadmin -> Ruolo
            $sql = "SELECT 
                        utente.Nome, 
                        utente.Cognome, 
                        utente.Indirizzo, 
                        utente.Email AS Email, 
                        NULL AS OpEmail,
                        NULL AS OpTipo, 
                        NULL AS OpRuolo,
                        NULL AS AdRuolo, 
                        cittadino.Stato AS Stato
                    FROM utente
                    JOIN cittadino ON utente.IDUtente = cittadino.IDCittadino
                    WHERE cittadino.IDCittadino = :id
                    UNION
                    SELECT 
                        utente.Nome, 
                        utente.Cognome, 
                        utente.Indirizzo, 
                        NULL AS Email,
                        operatore.Email AS OpEmail,
                        operatore.Tipo AS OpTipo, 
                        operatore.Ruolo AS OpRuolo,
                        NULL AS AdRuolo,
                        operatore.Stato AS Stato
                    FROM operatore
                    JOIN utente ON utente.IDUtente = operatore.IDOperatore
                    WHERE operatore.IDOperatore = :id
                    UNION
                    SELECT 
                        utente.Nome, 
                        utente.Cognome, 
                        utente.Indirizzo, 
                        utente.Email AS Email, 
						NULL AS OpEmail,
                        NULL AS OpTipo, 
                        NULL AS OpRuolo,
                        superadmin.Ruolo AS AdRuolo,
                        superadmin.Stato AS Stato
                    FROM superadmin
                    JOIN utente ON utente.IDUtente = superadmin.IDSuperAdmin
                    WHERE superadmin.IDSuperAdmin = :id;";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':id' => $id]);
            $queryResult = $stmt->fetchAll(PDO::FETCH_ASSOC); // Ottieni tutte le tuple
            try {
                $userData = getUserDataByPermission($queryResult, $permesso);

                // Cicla su ogni campo della tupla e salva nella sessione
                foreach ($userData as $campo => $valore) {
                    $_SESSION['user_' . $campo] = $valore;
                }
                var_dump($_SESSION);
                if(($_SESSION['user_Stato'] == '2') || ($_SESSION['user_Stato'] == '3')){
                    $output = 'errore=';
                    $output .= ($_SESSION['user_Stato'] == '2') ? urlencode("ERRORE: Il tuo account risulta sospeso.") : urlencode("ERRORE: Il tuo account risulta eliminato.");
                    // Elimino la sessione
                    session_unset();
                    session_destroy();
                    header('location: '.$location.'?'.$output);
                    exit();
                }
                
            } catch (Exception $e) {
                echo "Errore: " . $e->getMessage();
                $output = 'errore='.urlencode("ERRORE: qualcosa è andato storto...");
                header('location: '.$location.'?'.$output);
            }
            // Prima di reindirizzare alla pagina aggiungo nella tabella di log che l'utente si è loggato
            date_default_timezone_set("Europe/Rome"); // Imposta il fuso orario per l'Italia
            $dataAttuale = date("Y-m-d H:i:s", time()); // es output: 2024-12-14 15:20:34
            $sql = "INSERT INTO `log`(`idUtente`, `Data`, `Descrizione`) 
                    VALUES (:id,:dataTempo,:descrizione)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':id' => $id,
                ':dataTempo' => $dataAttuale,
                ':descrizione' => 'Ha effettuato il login'
            ]);
            
            // Close connection
            unset($pdo);   
            $output = 'successo='.urlencode('LOGIN AVVENUTO CON SUCCESSO');   
            header('location: '.$location.'?'.$output);
            die();
        }
        
    }catch(PDOException $e){
        echo "ERROR: Could not able to execute $sql." . $e->getMessage();
        $output = 'errore='.urlencode("ERRORE: qualcosa è andato storto...");
        header('location: '.$location.'?'.$output);
    }
}

if(empty($_POST)){
    // La POST è vuota
    $output = 'errore='.urlencode("ERROR: Tentativo di accesso non consentito, le autorità saranno lì a breve...");
    header('location: '.$location.'?'.$output);
}

$location = $_POST['url'] ?? "index.php";
$email = $_POST['member-login-number'] ?? '';
$password = $_POST['member-login-password'] ?? ''; // Ricevo al psw già hashata
echo "LOC: ".$location.", email: ".$email."<br>psw: ".$password."<br>md5(123): ".md5('1213');

// Inizio a controllare se esiste la mail all'interno del mio database
try {
    $sql = "SELECT 'utente' AS tipo, utente.IDUtente AS ID 
            FROM utente 
            WHERE utente.Email = :email                 
            UNION                
            SELECT 'operatore' AS tipo, operatore.IDOperatore AS ID 
            FROM operatore 
            WHERE operatore.Email = :email";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':email' => $email]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!empty($result)) {
        $permesso = $result['tipo'];
        $id = $result['ID'];

        echo "<br>Permesso: ".$permesso.", IDUTENTE: ".$id."<br>";
        switch ($permesso) {
            case 'utente':
                // Distinzione tra cittadino e superAdmin. 
                // In questo modo scopro il permesso di chi si registra
                $sql = "SELECT 'cittadino' AS ruolo
                        FROM cittadino 
                        WHERE IDCittadino = :id 
                        UNION 
                        SELECT 'superAdmin' AS ruolo 
                        FROM superadmin 
                        WHERE IDSuperAdmin = :id;";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':id' => $id]);
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo "VARDUMP RESULT: ".sizeof($result)."<br>";
                var_dump($result);
                // Creazione della lista
                $uroli = [];
                foreach ($result as $row) {
                    $ruoli[] = $row['ruolo'];
                }
                echo "<br>Permesso 2: <br>";
                var_dump($ruoli);
                // Controllo se esiste la password è corretta o meno
                foreach($ruoli as $permesso){
                    echo "<br>PERMESSO: ".$permesso."<br>";
                    verificaPassword($id, $password, $permesso);
                }
                
                break;
            case 'operatore':
                // Controllo se esiste la password è corretta o meno
                verificaPassword($id, $password, $permesso);
                break;
            default:
                $output = 'errore='.urlencode("Errore: Permesso utente non riconosciuto.");
                break;
            $output = 'errore='.urlencode("PASSWORD NON CORRETTA");
        }
    } else {
        $output = 'errore='.urlencode("Errore: Email non trovata");
    }

    // Close connection
    unset($pdo);
    header('location: '.$location.'?'.$output);

}catch(PDOException $e){
    echo "ERROR: Could not able to execute $sql." . $e->getMessage();
    $output = 'errore='.urlencode("ERRORE: qualcosa è andato storto...");
    header('location: '.$location.'?'.$output);
}

?>