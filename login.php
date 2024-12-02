<?php
include("connessione_db.php");
session_start(); // Inizio a salvarmi la sessione dell'utente
// unset($_SESSION['url']);

if((!isset($_GET['url'])) && (!isset($_SESSION['url']))) {
    $location = "index.php";
}else{
    $location = $_GET['url'] ?? $_SESSION['url'];
}
$_SESSION['url'] = $location;

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
        echo "<br>muori<br>";
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
        die("Errore: Permesso non valido.");
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
            ':psw' => md5($psw),
        ]);
      
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        var_dump($result);
        $ris = '';
        if($result){
            $ris = $result['STM'];
        }

        if($ris){
            echo "<br> PASSWORD CORRETTA! <br>";
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
                        NULL AS AdRuolo
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
                        NULL AS AdRuolo
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
                        superadmin.Ruolo AS AdRuolo
                    FROM superadmin
                    JOIN utente ON utente.IDUtente = superadmin.IDSuperAdmin
                    WHERE superadmin.IDSuperAdmin = :id;";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':id' => $id]);
            $queryResult = $stmt->fetchAll(PDO::FETCH_ASSOC); // Ottieni tutte le tuple
            try {
                $userData = getUserDataByPermission($queryResult, $permesso);
                print_r($userData); // Visualizza i dati

                // Cicla su ogni campo della tupla e salva nella sessione
                foreach ($userData as $campo => $valore) {
                    $_SESSION['user_' . $campo] = $valore;
                }
            } catch (Exception $e) {
                echo "Errore: " . $e->getMessage();
            }

            // Close connection
            unset($pdo);   
            sleep(3);
            header('location:'.$location);
        }
        
    }catch(PDOException $e){
        die("ERROR: Could not able to execute $sql." . $e->getMessage());
    }
}

if(!empty($_POST)){
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    echo "From POST-> Email: ".$email.", PSW: ".$password."<br>";
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
                    echo "Errore: Permesso utente non riconosciuto.";
                echo "ERRORE: PASSWORD NON CORRETTA";
            }
        } else {
            echo "Email non trovata.";
        }

    }catch(PDOException $e){
        die("ERROR: Could not able to execute $sql." . $e->getMessage());
    }
    // Close connection
    unset($pdo);
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LOGIN</title>
</head>
<body>
    <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
        <input type="email" name="email" id="login-email" placeholder="email">
        <input type="password" name="password" id="login-password" placeholder="psw">
        <button type="submit">REGISTRATI</button>    
    </form>
</body>
</html>