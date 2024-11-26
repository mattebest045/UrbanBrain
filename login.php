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

function verificaPassword($id, $psw, $permesso) {
    global $pdo;
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

        var_dump($ris);
        // Controllo risultato
        return $ris;
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
                        if(verificaPassword($id, $password, $permesso)){
                            echo "<br> PASSWORD CORRETTA! <br>";
                            header('location:'.$location);
                        }else{
                            echo "<br> PASSWORD NON CORRETTA! ".$permesso."<br>";
                        }
                    }
                    
                    break;
                case 'operatore':
                    // Controllo se esiste la password è corretta o meno
                    if(verificaPassword($id, $password, $permesso)){
                        echo "<br> PASSWORD CORRETTA! <br>";
                        header('location:'.$location);
                    }
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