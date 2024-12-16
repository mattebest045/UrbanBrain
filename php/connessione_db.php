<?php
$os = PHP_OS; 
$username = "root";

if (strtoupper(substr($os, 0, 3)) === 'WIN') { 
	$password = ""; // password BERTA
} elseif (strtoupper($os) === 'DARWIN') { 
	$password = "root"; // password BEST 
} else { 
	$password = ""; // password SCONOSCIUTO
	// echo "Lo script viene eseguito su un altro sistema operativo: $os"; 
}

$host = "localhost";
$database = "urbanbrain";

try{
	$pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $username, $password);
	// Set the PDO error made to exception
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e){
	die("ERROR: Could not connect. " . $e->getMessage());
}
?>