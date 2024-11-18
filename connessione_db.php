<?php
$username = "root";
$password = "";
$database = "urbanbrain";

try{
	$pdo = new PDO("mysql:host=localhost;databse=$database", $username, $password);
	// Set the PDO error made to exception
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e){
	die("ERROR: Could not connect. " . $e->getMessage());
}
?>