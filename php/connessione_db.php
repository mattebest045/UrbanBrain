<?php
$username = "root";
$password = "root"; // berta: '', best: 'root'
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