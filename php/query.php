<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['city'])) { 
    echo json_encode(getCharts($_POST['city']));
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['cities'])) { 
    echo json_encode(getCities());
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
        $sql = "SELECT citta.Nome 
                FROM citta 
                GROUP by citta.Nome 
                ORDER BY citta.Nome;
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
?>
