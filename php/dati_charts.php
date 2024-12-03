<?php
// - Temperatura, Umidità, Pressione atmosferica: [Line Chart] Grafici a linee sono ideali, 
//   in quanto rappresentano bene le variazioni continue nel tempo.
// - Qualità dell'aria, Livello di CO2, Livello di PM2.5/PM10: [Line Chart/Stacked Bar Chart]
//   Grafici a linee o a barre sovrapposte (stacked bar chart) per evidenziare la qualità e le concentrazioni.
// - Rumore, Velocità del vento, Direzione del vento: [Line Chart or Radar Chart] 
//   I grafici a linee o a radar (specialmente per la direzione del vento) possono visualizzare bene i dati.
// - Pioggia e Livello dell’acqua: [Bar Chart] Grafici a barre per mostrare cumulativamente la quantità.
// - Radiazione UV, Consumo energetico: [Line Chart] un grafico a linee può rappresentare bene i cambiamenti.
// - Stati come Rilevamento incendi, Controllo accessi: [Pie Chart or Bar Chart]
//   Grafici a torta per distribuire le proporzioni, oppure un grafico a barre per visualizzare gli stati ON/OFF. 

session_start(); // Inizio a salvarmi la sessione dell'utente

include("connessione_db.php");
	
try{
	// Query per ricavare tutte le città disponibili all'interno del nostro db
	$sql = "SELECT citta.Nome
			FROM citta
			GROUP by citta.Nome
			ORDER BY citta.Nome;";
	$result = $pdo->query($sql);
	if ($result->rowCount() > 0) {
		$value = array();
		// Itera sui risultati con un solo ciclo
		while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
			$value[] = $row['Nome']; // Campo 'Nome'
		}
	}
	// var_dump($value);
}catch(PDOException $e){
    die("ERROR: Could not able to execute $sql." . $e->getMessage());
}

// Query per ricavare i dati della pioggia a Roma
// Inizializza sessione con valori predefiniti
// echo "<br>POST: ".$_POST['tipo_sensore'].", ".$_POST['interval']."<br>";
if (!isset($_SESSION['tipo_sensore'])) {
	$_SESSION['tipo_sensore'] = "Pioggia";
}
if (!isset($_SESSION['interval'])) {
	$_SESSION['interval'] = "7 DAY";
}

// $citta =  $_GET['citta'] ?? $_SESSION['citta'];
// $_SESSION['citta'] = $citta;

// echo "Sensore: ".$_SESSION['tipo_sensore'].", Intervallo: ".$_SESSION['interval']."<br>";
// Aggiorna sessione se sono presenti nuove richieste POST
if (isset($_POST['interval'])) {
	$_SESSION['interval'] = ($_POST['interval'] === "Ultimo Mese") ? "1 MONTH" : "7 DAY";
}
if (isset($_POST['sensor'])) {
	$_SESSION['tipo_sensore'] = $_POST['sensor'];
}


// Recupera valori dalla sessione
$tipo_sensore = $_GET['tipo_sensore'] ?? $_SESSION['tipo_sensore'];
$interval = $_GET['interval'] ?? $_SESSION['interval'];
$citta =  $_GET['citta'] ?? $_SESSION['citta'];
// echo "SENSORE: ".$tipo_sensore."<br/>".$interval."<br/>".$citta."<br>";
if (isset($_POST['interval'])) {
	$interval = ($_POST['interval'] === "Ultimo Mese") ? "1 MONTH" : "7 DAY"; 
}

if(isset($_POST['sensor'])){ 
	switch ($_POST['sensor']) {
		case "Pioggia":
			$tipo_sensore = "Pioggia"; // vMax o Somma tot giornaliera
			break;
		case "Livello dell`acqua":
			$tipo_sensore = "Livello dell`acqua"; //vMax
			break;
		case "Temperatura":
			$tipo_sensore = "Temperatura"; // vMin, vMax
			break;
		case "Umidità":
			$tipo_sensore = "Umidità"; // vMin, vMedio, vMax
			break;
		case "Luminosità":
			$tipo_sensore = "Luminosità"; // vMedio, vMax
			break;
		case "Pressione atmosferica":
			$tipo_sensore = "Pressione atmosferica"; // vMedio
			break;
		case "Qualità dell`aria":
			$tipo_sensore = "Qualità dell`aria"; // vMax 
			break;
		case "Rumore":
			$tipo_sensore = "Rumore"; // vMax
			break;
		case "Livello di CO2":
			$tipo_sensore = "Livello di CO2"; // vMax
			break;
		case "Velocità del vento":
			$tipo_sensore = "Velocità del vento"; // vMax
			break;
		case "Direzione del vento":
			$tipo_sensore = "Direzione del vento"; // vMedio
			break;
		case "Radiazione UV":
			$tipo_sensore = "Radiazione UV"; // vMax
			break;
		case "Consumo energetico":
			$tipo_sensore = "Consumo energetico"; // vMedio
			break;
		case "Livello di PM2.5":// Guarda bar chart di 3bmeteo
			$tipo_sensore = "Livello di PM2.5"; // vMax , potrei includerlo nella qualità aria
			break;
		case "Livello di PM10":
			$tipo_sensore = "Livello di PM10"; // vMax, potrei includerlo nella qualità aria
			break;
		case "Rilevamento incendi":
			$tipo_sensore = "Rilevamento incendi"; // vMax
			break;
		case "Rilevamento gas":
			$tipo_sensore = "Rilevamento gas"; // vMax
			break;
		case "Vibrazioni":
			$tipo_sensore = "Vibrazioni"; // vMax
			break;
		default:
			// Valore predefinito se `$_POST['sensor']` non corrisponde
			$tipo_sensore = "Sconosciuto";
			break;
	}		
}

try{
	$sensori = [
		'valore_medio' => ["Pressione atmosferica", "Direzione del vento", "Consumo energetico"],
		'valore_max' => ["Pioggia", "Livello dell`acqua", "Qualità dell`aria",
							"Rumore", "Livello di CO2", "Velocità del vento", "Livello di PM2.5", 
							"Livello di PM10", "Radiazione UV", "Rilevamento incendi",
							"Rilevamento gas", "Vibrazioni"],
		'valore_min_max' => ["Temperatura", "Luminosità"],
		'valore_min_medio_max' => ["Umidità"]
	];
	
	if (in_array($tipo_sensore, $sensori['valore_medio'])) {
		// Codice per sensori con valore medio
		$sql =  "SELECT DATE(dato.Data) as Giorno, AVG(dato.Valore) as ValoreMedio 
			FROM dato 
			JOIN sensore ON sensore.IDSensore = dato.idSensore 
			JOIN citta ON citta.IDCitta = sensore.idCitta 
			WHERE citta.nome = '".$citta."' AND 
			sensore.Tipo = '".$tipo_sensore."' AND 
			dato.Data >= DATE_SUB(CURDATE(), INTERVAL ".$interval.") 
			GROUP BY Giorno 
			ORDER BY Giorno ASC;";
	} elseif (in_array($tipo_sensore, $sensori['valore_max'])) {
		// Codice per sensori con valore massimo
		$sql = "SELECT 
					DATE(dato.Data) as Giorno,  
					MAX(dato.Valore) as ValoreMax 
				FROM dato 
				JOIN sensore ON sensore.IDSensore = dato.idSensore 
				JOIN citta ON citta.IDCitta = sensore.idCitta 
				WHERE citta.nome = '" . $citta . "' AND 
					sensore.Tipo = '" . $tipo_sensore . "' AND 
					dato.Data >= DATE_SUB(CURDATE(), INTERVAL " . $interval . ") 
				GROUP BY Giorno 
				ORDER BY Giorno ASC;";
	} elseif (in_array($tipo_sensore, $sensori['valore_min_max'])) {
		// Codice per sensori con minimo e massimo
		$sql = "SELECT 
					DATE(dato.Data) as Giorno,  
					MIN(dato.Valore) as ValoreMin, 
					MAX(dato.Valore) as ValoreMax 
				FROM dato 
				JOIN sensore ON sensore.IDSensore = dato.idSensore 
				JOIN citta ON citta.IDCitta = sensore.idCitta 
				WHERE citta.nome = '" . $citta . "' AND 
					sensore.Tipo = '" . $tipo_sensore . "' AND 
					dato.Data >= DATE_SUB(CURDATE(), INTERVAL " . $interval . ") 
				GROUP BY Giorno 
				ORDER BY Giorno ASC;";
	} elseif (in_array($tipo_sensore, $sensori['valore_min_medio_max'])) {
		// Codice per sensori con minimo, medio e massimo
		$sql = "SELECT 
					DATE(dato.Data) as Giorno, 
					AVG(dato.Valore) as ValoreMedio, 
					MIN(dato.Valore) as ValoreMin, 
					MAX(dato.Valore) as ValoreMax 
				FROM dato 
				JOIN sensore ON sensore.IDSensore = dato.idSensore 
				JOIN citta ON citta.IDCitta = sensore.idCitta 
				WHERE citta.nome = '" . $citta . "' AND 
					sensore.Tipo = '" . $tipo_sensore . "' AND 
					dato.Data >= DATE_SUB(CURDATE(), INTERVAL " . $interval . ") 
				GROUP BY Giorno 
				ORDER BY Giorno ASC;";
	}else {
		session_unset(); // Rimuove tutti i valori contenuti in $_SESSION
		echo "Errore: intervallo non valido."; // Termina lo script con un messaggio di errore
		// Attendi 3 secondi
		sleep(3);
		// Reindirizza alla stessa pagina
		header("Location: " . $_SERVER['PHP_SELF']);
		exit();
	}
	$result = $pdo->query($sql);
	// echo "SQL: ".$sql."<br>";
	// echo "Result: ".print_r($result)."<br>";
	if($result->rowCount() > 0){
		$value = array();
		while ($row = $result->fetch()) {
			$data = [
				'Giorno' => $row['Giorno'], // Questo campo è sempre presente
			];
		
			// Aggiungi i campi solo se esistono
			if (isset($row['ValoreMedio'])) {
				$data['ValoreMedio'] = $row['ValoreMedio'];
			}
			if (isset($row['ValoreMin'])) {
				$data['ValoreMin'] = $row['ValoreMin'];
			}
			if (isset($row['ValoreMax'])) {
				$data['ValoreMax'] = $row['ValoreMax'];
			}
		
			$value[] = $data;
		}					
		// echo "Value: ".print_r($value);
		unset($result);
	}else{
		echo "No records matching your query were found.";
	}
}catch(PDOException $e){
	die("ERROR: Could not able to execute $sql." . $e->getMessage());
}

// Close connection
unset($pdo);

echo json_encode($value)."_";
echo json_encode($tipo_sensore);

?>