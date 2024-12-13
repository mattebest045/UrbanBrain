<!-- 
- Temperatura, Umidità, Pressione atmosferica: [Line Chart] Grafici a linee sono ideali, 
  in quanto rappresentano bene le variazioni continue nel tempo.
- Qualità dell'aria, Livello di CO2, Livello di PM2.5/PM10: [Line Chart/Stacked Bar Chart]
  Grafici a linee o a barre sovrapposte (stacked bar chart) per evidenziare la qualità e le concentrazioni.
- Rumore, Velocità del vento, Direzione del vento: [Line Chart or Radar Chart] 
  I grafici a linee o a radar (specialmente per la direzione del vento) possono visualizzare bene i dati.
- Pioggia e Livello dell’acqua: [Bar Chart] Grafici a barre per mostrare cumulativamente la quantità.
- Radiazione UV, Consumo energetico: [Line Chart] un grafico a linee può rappresentare bene i cambiamenti.
- Stati come Rilevamento incendi, Controllo accessi: [Pie Chart or Bar Chart]
  Grafici a torta per distribuire le proporzioni, oppure un grafico a barre per visualizzare gli stati ON/OFF. 
-->  

<?php
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



?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chart Dati</title>
    <!-- Foglio di stile inline -->
    <style>
        .barChart {
            width: 700px;
            margin: 0 auto; /* Per centrare la chart */
        }
    </style>
    <!-- Link a librerie esterne -->
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
	 
	<script>
	const configurazioneSensori = {
		"Temperatura": {
			unita: "°C",
			range: { min: -20.0, max: 50.0 },
			grafico: "line" // AREA CHART
		},
		"Umidità": {
			unita: "%",
			range: { min: 0.0, max: 100.0 },
			grafico: "line"
		},
		"Luminosità": {
			unita: "lx",
			range: { min: 0.0, max: 100000.0 },
			grafico: "line" // AREA CHART
		},
		"Pressione atmosferica": {
			unita: "hPa",
			range: { min: 950.0, max: 1050.0 },
			grafico: "line"
		},
		"Qualità dell`aria": {
			unita: "AQI",
			range: { min: 0.0, max: 500.0 },
			grafico: "bar" // Barre per rappresentare categorie
		},
		"Rumore": {
			unita: "dB",
			range: { min: 30.0, max: 130.0 },
			grafico: "line"
		},
		"Livello di CO2": {
			unita: "ppm",
			range: { min: 300.0, max: 5000.0 },
			grafico: "line"
		},
		"Velocità del vento": {
			unita: "m/s",
			range: { min: 0.0, max: 40.0 },
			grafico: "line"
		},
		"Direzione del vento": {
			unita: "°",
			range: { min: 0.0, max: 360.0 },
			grafico: "polarArea" // Grafico polare per direzioni
		},
		"Pioggia": {
			unita: "mm",
			range: { min: 0.0, max: 500.0 },
			grafico: "bar"
		},
		"Livello dell`acqua": {
			unita: "m",
			range: { min: 0.0, max: 10.0 },
			grafico: "bar"
		},
		"Radiazione UV": {
			unita: "UV",
			range: { min: 0.0, max: 11.0 },
			grafico: "bar"
		},
		"Consumo energetico": {
			unita: "kWh",
			range: { min: 0.0, max: 10000.0 },
			grafico: "line"
		},
		"Livello di PM2.5": {
			unita: "µg/m³",
			range: { min: 0.0, max: 500.0 },
			grafico: "line"
		},
		"Livello di PM10": {
			unita: "µg/m³",
			range: { min: 0.0, max: 500.0 },
			grafico: "line"
		},
		"Rilevamento incendi": {
			unita: "MJ",
			range: { min: 0.0, max: 1.0 },
			grafico: "line"
		},
		"Rilevamento gas": {
			unita: "ppm",
			range: { min: 0.0, max: 1000.0 },
			grafico: "line"
		},
		"Vibrazioni": {
			unita: "m/s²",
			range: { min: 0.0, max: 10.0 },
			grafico: "line"
		}
	};

	// controlla che la lista non sia nulla prima di fare una post
	// document.querySelector('form').addEventListener('submit', function(event) {
	// 	const sensorInput = document.getElementById('sensor').value.trim();
	// 	if (!sensorInput) {
	// 		alert("Per favore seleziona un sensore dalla lista!");
	// 		event.preventDefault(); // Blocca l'invio del form
	// 	}
	// });

	document.addEventListener("DOMContentLoaded", () => {
		// Assicurati che `ruoloAdmin` non sia null o undefined
		const citta = <?php echo json_encode($value, JSON_HEX_TAG); ?> || [];
		// console.log("citta: "+citta)
		// Riferimenti agli elementi HTML
		const lista_citta = document.getElementById("dati-citta");
		if (lista_citta) {
			// Svuota la datalist corrente
			lista_citta.innerHTML = "";
			// Aggiungi i nuovi ruoli
			citta.forEach(role => {
				const option = document.createElement("option");
				option.value = role;
				lista_citta.appendChild(option);
			});
		}
	})
	</script>
</head>
<body>
<!-- BAR CAHRT-->
	<?php
	// Query per ricavare i dati della pioggia a Roma
	// Inizializza sessione con valori predefiniti
	// echo "<br>POST: ".$_POST['tipo_sensore'].", ".$_POST['interval']."<br>";
	if (!isset($_SESSION['tipo_sensore'])) {
		$_SESSION['tipo_sensore'] = "Pioggia";
	}
	if (!isset($_SESSION['interval'])) {
		$_SESSION['interval'] = "7 DAY";
	}
	
	if((!isset($_GET['citta'])) && (!isset($_SESSION['citta']))) {
		die("ERRORE: nessuna città selezionata");
	}else{
		$citta =  $_GET['citta'] ?? $_SESSION['citta'];
		$_SESSION['citta'] = $citta;
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
	$citta = $_SESSION['citta'];
	echo "<br>".$citta.", ".$interval.", ".$tipo_sensore."<br>";
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
	?>

	<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
		<input type="submit" value="Ultimi 7 Giorni" name="interval" />
		<input type="submit" value="Ultimo Mese" name="interval" />
	</form>
	<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="get">
	<label for="dati-citta">Città:</label>
        <input list="dati-citta" id="citta-dati" name="citta" placeholder="Seleziona una città...">
        <datalist id="dati-citta">
            <!-- I ruoli verranno aggiunti dinamicamente -->
        </datalist> 
		
	</form>
	<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
		<label for="sensor">Seleziona un sensore:</label>
		<input list="sensors" id="sensor" name="sensor" placeholder="Cerca un sensore..." required>
		
		<datalist id="sensors">
			<option value="Temperatura">
			<option value="Umidità">
			<option value="Luminosità">
			<option value="Pressione atmosferica">
			<option value="Qualità dell`aria">
			<option value="Rumore">
			<option value="Livello di CO2">
			<option value="Velocità del vento">
			<option value="Direzione del vento">
			<option value="Pioggia">
			<option value="Livello dell`acqua">
			<option value="Radiazione UV">
			<option value="Consumo energetico">
			<option value="Livello di PM2.5">
			<option value="Livello di PM10">
			<option value="Rilevamento incendi">
			<option value="Rilevamento gas">
			<option value="Vibrazioni">
		</datalist>
		
    	<button type="submit">Invia</button>
	</form>


	<div class="barChart">
	<canvas id="chart"></canvas>
	</div>

	
	<!-- SCRIPT BAR CHART -->
	<script>
	const dataFromPHP = <?php echo json_encode($value); ?>;
	const tipoSensore = <?php echo json_encode($tipo_sensore); ?>;
	console.log(dataFromPHP)
	</script>
	<script src="charts.js"></script>

</body>
</html>
