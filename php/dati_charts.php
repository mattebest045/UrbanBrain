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

// session_start(); // Inizio a salvarmi la sessione dell'utente

include("connessione_db.php");

// Recupera valori dalla sessione
$tipo_sensore = $_GET['tipo_sensore'];
$interval = $_GET['interval'];
$citta =  $_GET['citta'];
$value = null;

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
		$sql = "SELECT 
					DATE(DATO.Data) as Giorno,
					AVG(DATO.Valore) as ValoreMedio 
				FROM DATO 
				JOIN SENSORE ON SENSORE.IDSensore = DATO.idSensore 
				JOIN CITTA ON CITTA.IDCitta = SENSORE.idCitta 
				WHERE
					CITTA.nome = '".$citta."' 
					AND SENSORE.Tipo = '".$tipo_sensore."'
					AND DATO.Data >= DATE_SUB(CURDATE(), INTERVAL ".$interval.") 
				GROUP BY Giorno 
				ORDER BY Giorno ASC;";
	} elseif (in_array($tipo_sensore, $sensori['valore_max'])) {
		// Codice per sensori con valore massimo
		$sql = "SELECT 
					DATE(DATO.Data) as Giorno,  
					MAX(DATO.Valore) as ValoreMax 
				FROM DATO 
				JOIN SENSORE ON SENSORE.IDSensore = DATO.idSensore 
				JOIN CITTA ON CITTA.IDCitta = SENSORE.idCitta 
				WHERE 
					CITTA.nome = '" . $citta . "' AND 
					SENSORE.Tipo = '" . $tipo_sensore . "' AND 
					DATO.Data >= DATE_SUB(CURDATE(), INTERVAL " . $interval . ") 
				GROUP BY Giorno 
				ORDER BY Giorno ASC;";
	} elseif (in_array($tipo_sensore, $sensori['valore_min_max'])) {
		// Codice per sensori con minimo e massimo
		$sql = "SELECT 
					DATE(DATO.Data) as Giorno,  
					MIN(DATO.Valore) as ValoreMin, 
					MAX(DATO.Valore) as ValoreMax 
				FROM DATO 
				JOIN SENSORE ON SENSORE.IDSensore = DATO.idSensore 
				JOIN CITTA ON CITTA.IDCitta = SENSORE.idCitta 
				WHERE 
					CITTA.nome = '" . $citta . "' AND 
					SENSORE.Tipo = '" . $tipo_sensore . "' AND 
					DATO.Data >= DATE_SUB(CURDATE(), INTERVAL " . $interval . ") 
				GROUP BY Giorno 
				ORDER BY Giorno ASC;";
	} elseif (in_array($tipo_sensore, $sensori['valore_min_medio_max'])) {
		// Codice per sensori con minimo, medio e massimo
		$sql = "SELECT 
					DATE(DATO.Data) as Giorno, 
					AVG(DATO.Valore) as ValoreMedio, 
					MIN(DATO.Valore) as ValoreMin, 
					MAX(DATO.Valore) as ValoreMax 
				FROM DATO 
				JOIN SENSORE ON SENSORE.IDSensore = DATO.idSensore 
				JOIN CITTA ON CITTA.IDCitta = SENSORE.idCitta 
				WHERE 
					CITTA.nome = '" . $citta . "' AND 
					SENSORE.Tipo = '" . $tipo_sensore . "' AND 
					DATO.Data >= DATE_SUB(CURDATE(), INTERVAL " . $interval . ") 
				GROUP BY Giorno 
				ORDER BY Giorno ASC;";
	} else {
		// session_unset(); // Rimuove tutti i valori contenuti in $_SESSION
		$value = [
			'Errore' => 'Sensore non valido.'
		];

		echo json_encode($value)."_";
		echo json_encode($tipo_sensore);
		die();
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
		if (empty($value)){
			$value = [
				'Errore' => 'Nessun dato disponibile.'
			];
		}
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