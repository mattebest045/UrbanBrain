<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['city'])) { 
    echo json_encode(getCharts($_POST['city']));
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['cities'])) { 
    echo json_encode(getCities());
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['member-signup-permission'])) { 
    echo json_encode(getDataList($_POST['member-signup-permission']));
    exit;
}


function getCharts($city) {
    include("connessione_db.php");
    try {
        // Query per ricavare tutte le città disponibili all'interno del nostro db
        $sql = "SELECT 
                    c.Nome,
                    s.Tipo
                FROM 
                    CITTA as c, 
                    SENSORE as s
                WHERE 
                    c.IDCitta = s.idCitta
                    AND c.Nome = :city
                GROUP BY 
                    s.Tipo
                ";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':city', $city, PDO::PARAM_STR);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Controlla se ci sono risultati
        if ($results) {
            return $results;
        } else {
            return "Nessun risultato trovato per la città: " . $city;
        }
    } catch(PDOException $e) {
        die("ERROR: Could not able to execute $sql. " . $e->getMessage());
    }
    unset($pdo);
}

function getCities() {
    include("connessione_db.php");
    try {
        // Query per ricavare tutte le città disponibili all'interno del nostro db
        $sql = "SELECT CITTA.Nome 
                FROM CITTA 
                GROUP by Nome 
                ORDER BY Nome;
                ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Controlla se ci sono risultati
        if ($results) {
            return $results;
        } else {
            return "Nessuna città trovata.";
        }
    } catch(PDOException $e) {
        die("ERROR: Could not able to execute $sql. " . $e->getMessage());
    }
    unset($pdo);
}

function getDataList($permission){
    include("connessione_db.php");
    if($permission === "operator"){
        try{
            $sql ="SELECT OPERATORE.Tipo, OPERATORE.Ruolo 
                FROM OPERATORE
                GROUP by Ruolo
                ORDER by Tipo, Ruolo;";
            $result = $pdo->query($sql);

            if($result->rowCount() > 0){
                $value = array();
                while ($row = $result->fetch()){
                    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                        $tipo = $row['Tipo']; // Campo 'Tipo'
                        $ruolo = $row['Ruolo']; // Campo 'Ruolo'
                        // Raggruppa i ruoli sotto il tipo corrispondente
                        if (!isset($value[$tipo])) {
                            $value[$tipo] = array(); // Inizializza l'array per il tipo
                        }
                        $value[$tipo][] = $ruolo;
                    }
                }
            }
        }catch(PDOException $e){
            echo "ERROR: Could not able to execute $sql." . $e->getMessage();
            $output = 'errore='.urlencode("ERRORE: qualcosa è andato storto...");
            header('location: '.$location.'?'.$output);
        }
    }else if($permission === "admin"){
        try{
            $sql = "SELECT SUPERADMIN.Ruolo
                    FROM SUPERADMIN
                    GROUP BY Ruolo
                    ORDER BY Ruolo ASC;";
            $result = $pdo->query($sql);
            if ($result->rowCount() > 0) {
                echo "<br>BElla<br>";
                $value = array();
            
                // Itera sui risultati con un solo ciclo
                while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                    $value[] = $row['Ruolo']; // Campo 'Ruolo'
                }
            }
        }catch(PDOException $e){
            echo "ERROR: Could not able to execute $sql." . $e->getMessage();
            $output = 'errore='.urlencode("ERRORE: qualcosa è andato storto...");
            header('location: '.$location.'?'.$output);
        }
    }else if($permission !== "citizen"){
        $output = 'errore='.urlencode("ERRORE: qualcosa è andato storto...");
        header('location: '.$location.'?'.$output);
        exit();
    }
    unset($pdo);
    return $value;
}
?>
