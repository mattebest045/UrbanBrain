<?php

$username = "root"; 		// locale 'root'	 		altervista 'urbanbrain'
$password = '';					// locale ''				altervista ''
$host = "localhost";			// locale 'localhost'		altervista 'localhost'
$database = "urbanbrain"; 	// locale 'urbanbrain'	 	altervista 'my_urbanbrain'

try{
	$pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $username, $password);
	// Set the PDO error made to exception
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e){
	die("ERROR: Could not connect. " . $e->getMessage());
}
?>