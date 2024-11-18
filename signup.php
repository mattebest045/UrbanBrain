<?php
// http://127.0.0.1/uni/signup.php?member-signup-name=Alessandro&member-signup-surname=Bertani&member-signup-birthday=2024-12-12&member-signup-email=alessandro.bertani02@roberto.com&member-signup-phone=3434343434&member-signup-address=via%20dai%20coglioni,34&member-signup-permission=citizen

include("connessione_db.php");

function validazione_dati(){
    global $nome, $cognome, $dataNascita, $email, $telefono, $indirizzo, $permission, $validPermissions;

    // Fase di validazione dei dati
    $errors = [];
    if (empty($nome)) {
        $errors[] = "Il nome è obbligatorio.";
    } elseif (!preg_match("/^[a-zA-ZÀ-ÿ0-9 '-]+$/", $nome)) {
        $errors[] = "Il nome contiene caratteri non validi.";
    }
    
    // Validazione del cognome
    if (empty($cognome)) {
        $errors[] = "Il cognome è obbligatorio.";
    } elseif (!preg_match("/^[a-zA-ZÀ-ÿ0-9 '-]+$/", $cognome)) {
        $errors[] = "Il cognome contiene caratteri non validi.";
    }
    
    // Validazione della data di nascita
    if (empty($dataNascita)) {
        $errors[] = "La data di nascita è obbligatoria.";
    } elseif (!DateTime::createFromFormat('Y-m-d', $dataNascita)) {
        $errors[] = "La data di nascita non è valida. Usa il formato YYYY-MM-DD.";
    }
    
    // Validazione dell'email
    if (empty($email)) {
        $errors[] = "L'email è obbligatoria.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "L'email non è valida.";
    }
    
    // Validazione del telefono
    if (empty($telefono)) {
        $errors[] = "Il numero di telefono è obbligatorio.";
    } elseif (!preg_match("/^\+?[0-9]{8,12}$/", $telefono)) {
        $errors[] = "Il numero di telefono non è valido. Deve contenere solo numeri e un eventuale prefisso internazionale.";
    }
    
    // Validazione dell'indirizzo
    if (empty($indirizzo)) {
        $errors[] = "L'indirizzo è obbligatorio.";
    }
    
    // Validazione del permesso
    if (!in_array($permission, $validPermissions)) {
        $errors[] = "Il permesso selezionato non è valido.";
    }
    
    // Output degli errori
    if (!empty($errors)) {
        foreach ($errors as $error) {
            echo "<p style='color: red;'>$error</p>";
        }
    } else {
        echo "<p style='color: green;'>Tutti i dati sono validi!</p>";
        // Procedi con l'elaborazione, ad esempio salvataggio nel database
    }
}

$validPermissions = ['citizen', 'operator', 'admin']; // valori di validazione accettabili
$ruoli_superadmin = [
    "System Administrator", # Gestisce e mantiene i server e i sistemi operativi, assicurandosi che l'infrastruttura tecnica sia sicura e aggiornata
    "Data Security Officer", # Supervisiona la sicurezza dei dati e assicura che tutte le informazioni siano protette da accessi non autorizzati
    "Network Architect", # Progetta e implementa le reti interne e i sistemi di comunicazione, garantendo che l'infrastruttura di rete sia efficiente e sicura
    "Compliance Manager", # Verifica che tutte le operazioni siano conformi alle normative e agli standard di sicurezza e privacy
    "Data Protection Officer (DPO)", # Responsabile della protezione dei dati personali e della conformità al GDPR o ad altre leggi sulla protezione dei dati
    "Audit Supervisor", # Esegue verifiche interne periodiche per garantire la sicurezza e l'integrità dei sistemi e dei dati
    "Incident Response Coordinator", # Gestisce le emergenze di sicurezza, come violazioni dei dati, e coordina le risposte per mitigare i danni
    "Infrastructure Manager", # Supervisiona l'infrastruttura IT e coordina gli aggiornamenti, le riparazioni e l'espansione dei sistemi
    "Service Manager", # Gestisce i servizi offerti dall’infrastruttura IT e assicura il rispetto dei livelli di servizio (SLA) per gli utenti finali
    "Risk Manager", # Identifica i rischi per la sicurezza e la continuità operativa e sviluppa piani di mitigazione
    "Policy Developer", # Scrive e aggiorna le policy interne su sicurezza, privacy e operazioni IT
    "Access Control Manager", # Gestisce i permessi di accesso e le autorizzazioni per i diversi utenti e operatori del sistema
    "Backup and Recovery Specialist", # Assicura che i dati siano regolarmente salvati e che i sistemi di recupero siano pronti in caso di necessità
    "Operations Supervisor", # Supervisiona l’efficienza delle operazioni giornaliere dei sistemi e coordina i team di supporto
    "Cybersecurity Analyst" # Analizza costantemente la sicurezza dei sistemi per rilevare e prevenire potenziali minacce.")
];

// DA FARE LA QUERY PER IL RUOLO ADMIN
try{
    
    // Query in cui ricavo tutti i valori dei campi tipo e ruolo della tabella operatore 
    $sql ="SELECT urbanbrain.operatore.Tipo, urbanbrain.operatore.Ruolo 
            FROM urbanbrain.operatore
            GROUP by urbanbrain.operatore.Ruolo
            ORDER by urbanbrain.operatore.Tipo, urbanbrain.operatore.Ruolo;";
    $result = $pdo->query($sql);
    
    if($result->rowCount() > 0){
        $value = array();
        while ($row = $result->fetch()){
            $tipo_ruoli_operatore = array(); // Array finale

            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $tipo = $row['Tipo']; // Campo 'Tipo'
                $ruolo = $row['Ruolo']; // Campo 'Ruolo'
        
                // Raggruppa i ruoli sotto il tipo corrispondente
                if (!isset($tipo_ruoli_operatore[$tipo])) {
                    $tipo_ruoli_operatore[$tipo] = array(); // Inizializza l'array per il tipo
                }
                $tipo_ruoli_operatore[$tipo][] = $ruolo;
            }

        }
    }


}catch(PDOException $e){
    die("ERROR: Could not able to execute $sql." . $e->getMessage());
}
// Close connection
unset($pdo);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            // Dizionario con tipi di operatori e ruoli
           const tipiOperatori = <?php echo json_encode($tipo_ruoli_operatore); ?>; 
           
           console.log(tipiOperatori) 

            // Riferimenti agli elementi HTML
            const operatorType = document.getElementById("operator-type");
            const operatorRole = document.getElementById("operator-role");

            // Aggiorna la datalist in base al tipo selezionato
            operatorType.addEventListener("change", () => {
                const selectedType = operatorType.value;
                const roles = tipiOperatori[selectedType] || [];
                
                // Svuota la datalist corrente
                operatorRole.innerHTML = "";

                // Aggiungi i nuovi ruoli
                roles.forEach(role => {
                    const option = document.createElement("option");
                    option.value = role;
                    operatorRole.appendChild(option);
                });
            });
        });
    </script>
</head>
<body>

<?php 

if(isset($_POST))

$nome = $_GET['member-signup-name'] ?? '';
$cognome = $_GET['member-signup-surname'] ?? '';
$dataNascita = $_GET['member-signup-birthday'] ?? '';
$email = $_GET['member-signup-email'] ?? '';
$telefono = $_GET['member-signup-phone'] ?? '';
$indirizzo = $_GET['member-signup-address'] ?? '';
$permission = $_GET['member-signup-permission'] ?? '';

echo "Nome: ".$nome."<br>Cognome: ".$cognome . 
     "<br>Data Nascita: ".$dataNascita."<br>email: ".$email.
     "<br>Indirizzo: ".$indirizzo."<br>Permission: ".$permission."<br>";

// Validazione del nome
validazione_dati();


?>
<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
    <input type="text" name="member-signup-permission" id="" value="<?php echo $permission; ?>">
    <br>
    <input type="text" name="member-signup-name" id="" value="<?php echo $nome; ?>">
    <input type="text" name="member-signup-surname" id="" value="<?php echo $cognome; ?>">
    <input type="date" name="member-signup-birthday" id="" value="<?php echo $dataNascita; ?>">
    <br>
    <input type="email" name="member-signup-email" id="" value="<?php echo $email; ?>">
    <input type="phone" name="member-signup-phone" id="" value="<?php echo $telefono; ?>">
    <input type="text" name="member-signup-address" id="" value="<?php echo $indirizzo; ?>">
    <br>
    <?php
    if($permission === $validPermissions[0]){ // Citizen
        echo '<input type="password" name="member-signup-pasword-cit" id="" placeholder="Inserire la password">';
        // Gestisco poi io lo stato (default a 0) e la dataIscrizione
    }else if($permission === $validPermissions[1]){ // Operator
        // Gestisco io poi lo Stato
        echo '
        <label for="operator-type">Tipo di Operatore:</label>
        <select id="operator-type" name="operator-type">
            <option value="" selected disabled hidden>-- Seleziona un tipo --</option>
            <option value="Creatori di eventi">Creatori di eventi</option>
            <option value="Operatori pubblici">Operatori pubblici</option>
            <option value="Funzionari comunali">Funzionari comunali</option>
            <option value="Tecnici manutentori">Tecnici manutentori</option>
            <option value="Agenti di sicurezza">Agenti di sicurezza</option>
            <option value="Analisti di dati urbani">Analisti di dati urbani</option>
            <option value="Addetti alle comunicazioni">Addetti alle comunicazioni</option>
            <option value="Pianificatori urbani">Pianificatori urbani</option>
            <option value="Gestori ambientali">Gestori ambientali</option>
            <option value="Operatori di assistenza sociale">Operatori di assistenza sociale</option>
        </select>

        <label for="operator-role">Ruolo:</label>
        <input list="operator-role" id="op-role" name="op-role" placeholder="Seleziona un ruolo...">
        <datalist id="operator-role">
            <!-- I ruoli verranno aggiunti dinamicamente -->
        </datalist>
        <br>
        <label for="input:date_inizio">Data inizio lavoro:</label>
        <input type="date" name="member-signup-date-start-op" id=""> 
        <label for="input:date_fine">Data fine lavoro:</label>
        <input type="date" name="member-signup-date-end-op" id=""> <br>
        <input type="email" name="member-signup-email-op" id="" placeholder="Inserire la mail">
        <input type="password" name="pasword" id="" placeholder="Inserire la password">';

    }else if($permission === $validPermissions[2]){ // SuperAdmin
        echo '
        <label for="superAdmin-role">Ruolo:</label>
        <input list="superAdmin-role" id="admin-role" name="admin-role" placeholder="Seleziona un ruolo...">
        <datalist id="superAdmin-role"> '; 
            foreach($ruoli_superadmin as $ruolo){
                echo '<option value="'.$ruolo.'">'.$ruolo.'</option>';
            }
        echo '  </datalist> ';

    }
    ?>
    <button type="submit">REGISTRATI</button>
</form>




</body>
</html>