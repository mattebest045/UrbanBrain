<!-- 
http://127.0.0.1/uni/signup.php?member-signup-name=Alessandro&member-signup-surname=Bertani&member-signup-birthday=2024-12-12&member-signup-email=alessandro.bertani02@roberto.com&member-signup-phone=3434343434&member-signup-address=via%20dai%20coglioni,34&member-signup-permission=citizen 
-->
<?php

include("connessione_db.php");

/**
 * Valida una password in base a requisiti comuni.
 *
 * @param string $password La password da validare.
 * @return bool True se la password è valida, false altrimenti.
 * La psw deve contenere:
 * Essere più lunga di 8 caratteri
 * Almeno una lettera minuscola
 * Almeno una lettera maiuscola
 * Almeno un numero
 * Almeno un carattere speciale tra quelli specificati [@$!%*?&]
 */
function validaPassword($password) {
    $pattern = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/";
    return preg_match($pattern, $password) === 1;
}

function validazione_dati($permission){
    global $nome, $cognome, $dataNascita, $email, $telefono, $indirizzo, $validPermissions;

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
    }else if($permission == $validPermissions[0]){ // controllo valori ulteriori cittadino
        global $citizenPsw;
        if (!validaPassword($citizenPsw)) {
            $errors[] = "La password per il cittadino non rispecchia i vincoli minimi.";
        }
    }else if($permission == $validPermissions[1]){ // controllo valori ulteriori operatore
        global $operatorType, $operatorRole, $operatorPsw, $operatorDateStart, $operatorDateEnd, $operatorEmail;
        if (empty($operatorType)) {
            $errors[] = "Il tipo di operatore è obbligatorio.";
        }

        if (empty($operatorRole)) {
            $errors[] = "Il ruolo dell'operatore è obbligatorio.";
        }

        if (empty($operatorDateStart)) {
            $errors[] = "La data di inizio attività è obbligatoria.";
        } elseif (!DateTime::createFromFormat('Y-m-d', $operatorDateStart)) {
            $errors[] = "La data di inizio attività non è valida. Usa il formato YYYY-MM-DD.";
        }

        if (isset($operatorDateEnd) && !DateTime::createFromFormat('Y-m-d', $operatorDateEnd)) {
            $errors[] = "La data di fine attività non è valida. Usa il formato YYYY-MM-DD.";
        }

        // Validazione dell'email
        if (empty($operatorEmail)) {
            $errors[] = "L'email dell'operatore è obbligatoria.";
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = "L'email dell'operatore non è valida.";
        }

        if (!validaPassword($operatorPsw)) {
            $errors[] = "La password per l'operatore non rispecchia i vincoli minimi.";
        }
    }else if($permission == $validPermissions[2]){ // controllo valori ulteriori admin
        global $adminRole, $adminPsw;
    
        if (!isset($adminRole)) {        
            $errors[] = "Il ruolo dell'amministratore è obbligatorio.";
        }

        if (!validaPassword($adminPsw)) {
            $errors[] = "La password per l'admin non rispecchia i vincoli minimi.";
        }
    }

    // Output degli errori
    if (!empty($errors)) {
        foreach ($errors as $error) {
            echo "<p style='color: red;'>$error</p>";
        }
        return false;
    } else {
        echo "<p style='color: green;'>Tutti i dati sono validi!</p>";
        // Procedi con l'elaborazione, ad esempio salvataggio nel database
        return true;
    }
}

function controllaID($permesso, $IDUtente){
    $permesso_it = ['cittadino', 'operatore', 'superAdmin'];
    global $pdo, $validPermissions;
    // Controlla se il permesso è valido
    $indice = array_search($permesso, $validPermissions);
    if ($indice === false) {
        die("Errore: permesso '$permesso' non valido.");
    }
    // Recupera la tabella corrispondente
    $tabella = $permesso_it[$indice];

    $sqlCheck = "SELECT ID".ucfirst($tabella)." FROM $tabella WHERE ID".ucfirst($tabella)." = :id";
    $stmtCheck = $pdo->prepare($sqlCheck);
    $stmtCheck->execute([':id' => $IDUtente]);

    if ($stmtCheck->rowCount() > 0) {
        die("Errore: l'IDOperatore $IDUtente esiste già nella tabella $tabella.");
        return false;
    }else{
        return true;
    }
}

function formattaData($data){
    if ($data) {
        try {
            $dateObject = new DateTime($data);
            $dataNascita = $dateObject->format('Y-m-d'); // Normalizza la data
            return $data;
        } catch (Exception $e) {
            die("Errore nel formato della data di nascita.");
        }
    } else {
        die("Data di nascita non fornita.");
    }
    return '';
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

$nome = $_POST['member-signup-name'] ?? $_GET['member-signup-name'];
$cognome = $_POST['member-signup-surname'] ?? $_GET['member-signup-surname'];
$dataNascita = $_POST['member-signup-birthday'] ?? $_GET['member-signup-birthday'];
$email = $_POST['member-signup-email'] ?? $_GET['member-signup-email'];
$telefono = $_POST['member-signup-phone'] ?? $_GET['member-signup-phone'];
$indirizzo = $_POST['member-signup-address'] ?? $_GET['member-signup-address'];
$permission = $_POST['member-signup-permission'] ?? $_GET['member-signup-permission']; // Ricavo il valore del permesso (cittadino/operatore/admin)

// campi ulteriori cittadino
$citizenPsw = $_POST['citizen-signup-pasword-cit'] ?? '';
// campi ulteriori operatore
$operatorType = $_POST['operator-signup-type-op'] ?? '';
$operatorRole = $_POST['op-role'] ?? '';
$operatorEmail = $_POST['operator-signup-email-op'] ?? '';
$operatorDateStart = $_POST['operator-signup-date-start-op'] ?? '';
$operatorDateEnd = $_POST['operator-signup-date-end-op'] ?? '';
$operatorPsw = $_POST['operator-signup-password-op'] ?? '';
// campi ulteriori admin
$adminRole = $_POST['admin-signup-role-adm'] ?? '';
$adminPsw = $_POST['admin-signup-psw-adm'] ?? '';

var_dump($_POST);
die();
// echo "<br>Nome: ".$nome."<br>Cognome: ".$cognome . 
// "<br>Data Nascita: ".$dataNascita."<br>email: ".$email.
// "<br>Indirizzo: ".$indirizzo."<br>Permission: ".$permission.
// "<br>Cittadino PSW: ".$citizenPsw.
// "<br>Operatore TYPE: ".$operatorType.", Ruolo: ".$operatorRole.", DateStart: ".$operatorDateStart.", DateEnd: ".$operatorDateEnd.
// "<br>Admin Role: ".$adminRole.", PSW: ".$adminPsw."<br>";


// echo "Permission: ".$permission;
// DA FARE LA QUERY PER IL RUOLO ADMIN
try{
    $tipo_ruoli_operatore = array(); // Array finale
    if(validazione_dati($permission)){
        // Scrivo query per utente (controlla se l'utente esiste già)
        if (!isset($IDUtente)) {
            // Esegui una query preparata per verificare se l'utente esiste già
            $sql = "SELECT utente.IDUtente
                    FROM utente
                    WHERE Nome = :nome
                      AND Cognome = :cognome
                      AND DataNascita = :dataNascita
                      AND Email = :email
                      AND Telefono = :telefono";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':nome' => $nome,
                ':cognome' => $cognome,
                ':dataNascita' => formattaData($dataNascita),
                ':email' => $email,
                ':telefono' => $telefono,
            ]);           
            // Controlla il risultato
            if ($stmt->rowCount() > 0) {
                $IDUtente = $stmt->fetch()['IDUtente'];
            } else {
                // Se l'utente non esiste ancora, inseriscilo
                $sqlInsert = "INSERT INTO utente (Nome, Cognome, DataNascita, Email, Telefono, Indirizzo)
                              VALUES (:nome, :cognome, :dataNascita, :email, :telefono, :indirizzo)";
                
                $stmtInsert = $pdo->prepare($sqlInsert);
                $stmtInsert->execute([
                    ':nome' => $nome,
                    ':cognome' => $cognome,
                    ':dataNascita' => formattaData($dataNascita),
                    ':email' => $email,
                    ':telefono' => $telefono,
                    ':indirizzo' => $indirizzo,
                ]);
                if ($stmtInsert->rowCount() > 0) {
                    $IDUtente = $pdo->lastInsertId();
                    echo "<br>IDUtente: ".$IDUtente;
                } else {
                    die("Errore nell'inserimento del nuovo utente.");
                }
            }
        }
               
        // Mappatura dei permessi a query e parametri
        $insertQueries = [
            'citizen' => [
                'query' => "INSERT INTO `cittadino`(`IDCittadino`, `Stato`, `DataRegistrazione`, `Password`) 
                            VALUES (:id, :stato, :dataRegistrazione, :password)",
                'params' => [
                    ':id' => $IDUtente,
                    ':stato' => 0, // Account non attivato
                    ':dataRegistrazione' => $dataNascita,
                    ':password' => md5($citizenPsw), // Hash abbastanza sicuro
                ]
            ],
            'operator' => [
                'query' => "INSERT INTO `operatore`(`IDOperatore`, `DataInizio`, `DataFine`, `Email`, `Tipo`, `Ruolo`, `Stato`, `Password`)
                            VALUES (:id, :dataInizio, :dataFine, :email, :tipo, :ruolo, :stato, :password)",
                'params' => [
                    ':id' => $IDUtente,
                    ':dataInizio' => $operatorDateStart,
                    ':dataFine' => $operatorDateEnd,
                    ':email' => $operatorEmail,
                    ':tipo' => $operatorType,
                    ':ruolo' => $operatorRole,
                    ':stato' => 0, // Account non attivato
                    ':password' => md5($operatorPsw), // Hash abbastanza sicuro
                ]
            ],
            'admin' => [
                'query' => "INSERT INTO `superadmin`(`IDSuperAdmin`, `Ruolo`, `DataAssegnazioneRuolo`, `Stato`, `UltimoAccesso`, `Password`) 
                            VALUES (:id, :ruolo, :dataAssegnazione, :stato, :ultimoAccesso, :password)",
                'params' => [
                    ':id' => $IDUtente,
                    ':ruolo' => $adminRole,
                    ':dataAssegnazione' => date('Y-m-d'),
                    ':stato' => 1, // Account attivo (modificabile secondo le esigenze)
                    ':ultimoAccesso' => date('Y-m-d H:i:s'),
                    ':password' => md5($adminPsw), // Hash abbastanza sicuro
                ]
            ]
        ];
        // Controlla se il permesso è valido e costruisce la query corrispondente
        if (array_key_exists($permission, $insertQueries)) {
            if(!controllaID($permission, $IDUtente)){
                exit;
            }
            $queryData = $insertQueries[$permission];
            $stmt = $pdo->prepare($queryData['query']);
            $stmt->execute($queryData['params']);
            echo "QUERY $permission INSERITA CON SUCCESSO";
            // Pulisco i dati appena inseriti:
            $nome = '';
            $cognome = '';
            $dataNascita = '';
            $email = '';
            $telefono = '';
            $indirizzo = '';
            $permission = '';
        } else {
            echo "Permesso non valido!";
        }
    }
    else if($permission == $validPermissions[1]){ // Operatore
        // Query in cui ricavo tutti i valori dei campi tipo e ruolo della tabella operatore 
        $sql ="SELECT operatore.Tipo, operatore.Ruolo 
            FROM operatore
            GROUP by operatore.Ruolo
            ORDER by operatore.Tipo, operatore.Ruolo;";
        $result = $pdo->query($sql);

        if($result->rowCount() > 0){
            $value = array();
            while ($row = $result->fetch()){
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
    }elseif($permission == $validPermissions[2]){ // Admin
        $sql = "SELECT superadmin.Ruolo
                FROM superadmin
                GROUP BY superadmin.Ruolo
                ORDER BY superadmin.Ruolo ASC;";
        $result = $pdo->query($sql);
        if ($result->rowCount() > 0) {
            echo "<br>BElla<br>";
            $value = array();
        
            // Itera sui risultati con un solo ciclo
            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $value[] = $row['Ruolo']; // Campo 'Ruolo'
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
            const validPermissions = <?php echo json_encode($validPermissions); ?>;      
            let ChoosenPermission = <?php echo json_encode($permission); ?>;

            if(ChoosenPermission === validPermissions[1]){ // Operator
                // Dizionario con tipi di operatori e ruoli
                const tipiOperatori = <?php echo json_encode($tipo_ruoli_operatore, JSON_HEX_TAG); ?>; 

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
            }else if(ChoosenPermission === validPermissions[2]){ // admin
                // Assicurati che `ruoloAdmin` non sia null o undefined
                const ruoloAdmin = <?php echo json_encode($value, JSON_HEX_TAG); ?> || [];
                // Riferimenti agli elementi HTML
                const superAdminRole = document.getElementById("superAdmin-role");
                
                if (superAdminRole) {
                    // Svuota la datalist corrente
                    superAdminRole.innerHTML = "";
                    // Aggiungi i nuovi ruoli
                    ruoloAdmin.forEach(role => {
                        const option = document.createElement("option");
                        option.value = role;
                        superAdminRole.appendChild(option);
                    });
                } else {
                    console.error("Elemento con ID 'superAdmin-role' non trovato.");
                }
            }
        });
    </script>
</head>
<body>

<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
    <input type="text" name="member-signup-permission" id="member-signup-permission" value="<?php echo $permission; ?>">
    <br>
    <input type="text" name="member-signup-name" id="member-signup-name" value="<?php echo $nome; ?>">
    <input type="text" name="member-signup-surname" id="member-signup-surname" value="<?php echo $cognome; ?>">
    <input type="date" name="member-signup-birthday" id="member-signup-birthday" value="<?php echo $dataNascita; ?>">
    <br>
    <input type="email" name="member-signup-email" id="member-signup-email" value="<?php echo $email; ?>">
    <input type="phone" name="member-signup-phone" id="member-signup-phone" value="<?php echo $telefono; ?>">
    <input type="text" name="member-signup-address" id="member-signup-address" value="<?php echo $indirizzo; ?>">
    <br>
    <?php
    if($permission === $validPermissions[0]){ // Citizen
        echo '<input type="password" name="member-signup-pasword-cit" id="member-signup-pasword-cit" placeholder="Inserire la password">';
        // Gestisco poi io lo stato (default a 0) e la dataIscrizione
    }else if($permission === $validPermissions[1]){ // Operator
        // Gestisco io poi lo Stato
        echo '
        <label for="operator-type">Tipo di Operatore:</label>
        <select id="operator-type" name="member-signup-type-op">
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
        <input type="date" name="member-signup-date-start-op" id="member-signup-date-start-op"> 
        <label for="input:date_fine">Data fine lavoro:</label>
        <input type="date" name="member-signup-date-end-op" id="member-signup-date-end-op"> <br>
        <input type="email" name="member-signup-email-op" id="member-signup-email-op" placeholder="Inserire la mail">
        <input type="password" name="member-signup-password-op" id="member-signup-password-op" placeholder="Inserire la password">';

    }else if($permission === $validPermissions[2]){ // SuperAdmin
        // DataAssegnazioneRuolo è di default
        
        echo '
        <label for="superAdmin-role">Ruolo:</label>
        <input list="superAdmin-role" id="admin-role" name="member-signup-role-adm" placeholder="Seleziona un ruolo...">
        <datalist id="superAdmin-role">
            <!-- I ruoli verranno aggiunti dinamicamente -->
        </datalist> 
        <input type="password" name="member-signup-psw-adm" id="" placeholder="Inserire la password">';

    }
    ?>
    <button type="submit">REGISTRATI</button>
</form>




</body>
</html>