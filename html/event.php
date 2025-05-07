<script>
    function toggleLuogo() {
        const checkbox = document.getElementById('evento_online');
        const luogoInput = document.getElementById('evento_luogo');
        const postiInput = document.getElementById('evento_nPosti')
        
        if (checkbox.checked) {
            // Disabilita l'input e imposta valore nullo
            luogoInput.placeholder="Inserire il link dell'evento";
            postiInput.disabled = true;
            postiInput.value = '';
        } else {
            // Riabilita l'input
            luogoInput.placeholder="Luogo";
            postiInput.disabled = false;
        }
    };
    function toggleCreazioneLuogo(){
        const checkbox = document.getElementById('creazione_evento_online');
        const postiInput = document.getElementById('creazione_evento_nPosti');

        if (checkbox.checked) {
            // Disabilita l'input e imposta valore nullo
            postiInput.disabled = true;
            postiInput.value = '';
        } else {
            // Riabilita l'input
            postiInput.disabled = false;
        }
    }
</script>

<?php
session_start();
include("connessione_db.php");
// unset($_SESSION['user_role']);
// unset($_POST);
$url_creazione = 'creazione_evento.php';
$url_partecipazione = 'partecipa_evento.php';

function estraiCitta($indirizzo) {
    // Cerca il primo numero a 4-6 cifre che potrebbe rappresentare un CAP
    if (preg_match('/\d{4,6}\s+([^,]+)/', $indirizzo, $matches)) {
        return trim($matches[1]); // La città è immediatamente dopo il CAP
    }
    
    // Se non c'è CAP, cerca dopo una virgola
    if (strpos($indirizzo, ',') !== false) {
        $parts = explode(',', $indirizzo);
        return trim(end($parts)); // Prendi l'ultima parte dell'indirizzo
    }

    // Default: restituisci l'indirizzo intero se non riesce a trovare la città
    return $indirizzo;
}

function statoToString($stato) {
    $stati = [
        0 => "Attivo",
        1 => "In fase di approvazione",
        2 => "Sospeso",
        3 => "Eliminato"
    ];
    return $stati[$stato] ?? "Stato sconosciuto"; // Default se lo stato non è riconosciuto
}


if(isset($_GET['errore']))
    echo '<p class="err">'.$_GET['errore'].'</p>';
if(isset($_GET['successo']))
    echo '<p class="suc">'.$_GET['successo'].'</p>';


// Per praticità
// $_SESSION['user_Indirizzo'] = "Bari";
$user_role = "cittadino";
$_SESSION['user_role'] = $user_role;
// echo "<br>ROLE: ".$_SESSION['user_role']."<br>";

// Validazione dati
// var_dump($_POST);
// var_dump($_SESSION);
echo '<hr>';
echo '<form action="'.$_SERVER['PHP_SELF'].'" method="post">
        <input type="text" id="creazione_evento_nome" name="event_search_tipo" placeholder="Tipo di evento...">
        <input type="text" id="evento_luogo" name="event_search_luogo" placeholder="Luogo">
        <input type="number" id="evento_nPosti" name="creazione_evento_nPosti" placeholder="Numero posti"> <br>
        <input type="datetime-local" name="event_search_data" placeholder="Data e luogo">
       
        <!-- Checkbox per evento online -->
        <label for="evento_online">Evento online?</label>
        <input type="checkbox" id="evento_online" name="event_search_online" onchange="toggleLuogo()">
        
        <button type="submit">Cerca evento</button>
    </form>';
echo '<hr>';
if(empty($_POST) && empty($_SESSION)){
    die();
}

$user_role = $_SESSION['user_role'] ?? 'no-role';

// echo "TIPO: ".$_POST['event_search_tipo'].
//     ", Online? ".((isset($_POST['event_search_online'])) ? 'SI' : 'NO').
//     ", Luogo: ".$_POST['event_search_luogo'].
//     ", Data: ".$_POST['event_search_data']."<br>";

$tipo_evento = $_POST['event_search_tipo'] ?? '';
$luogo_evento = $_POST['event_search_luogo'] ?? estraiCitta($_SESSION['user_Indirizzo']);
$data_tempo_evento = $_POST['event_search_data'] ?? '';
$evento_online = (isset($_POST['event_search_online'])) ? true : false; // Per star sicuro lo metto così. Non odiarmi per questo ahahah

echo "<br>ROLE: ".$_SESSION['user_role']."<br>";
//IDEA GENERALE: MOSTRARE SEMPRE DUE PANNELLI/CONTAINER
// - operatore: crea un nuovo evento + Unisciti ad eventi già creati
// - cittadino: Registrati ad un evento + Mostra eventi attivi nella città selezionata

if($user_role === "operatore"){ 
    echo "CREA UN EVENTO!!!";
    echo '<form action="'.$url_creazione.'" method="get">
        <input type="text" name="creazione_evento_nome" placeholder="Nome">
        <input type="text" id="creazione_evento_luogo" name="creazione_evento_luogo" placeholder="Luogo">
        <input type="number" id="creazione_evento_nPosti" name="creazione_evento_nPosti" placeholder="numero posti"> <br>
        <input type="datetime-local" name="creazione_evento_data" placeholder="data e luogo"> 

         <!-- Checkbox per evento online -->
        <label for="evento_online">Evento online?</label>
        <input type="checkbox" id="creazione_evento_online" name="creazione_evento_online" onchange="toggleCreazioneLuogo()">

        <input type="text" name="creazione_evento_descrizione" placeholder="aggiungi descrizione">
        <button type="submit">Crea evento</button>
    </form>';
    echo "<hr>OPPURE...<br>";
}



// Mostro gli eventi
try{
    // echo "TIPO: ".$tipo_evento.
    // ", Online? ".(($evento_online) ? 'SI' : 'NO').
    // ", Luogo: ".$luogo_evento.
    // ", Data: ".$data_tempo_evento."<br>";


    $sql = 'SELECT *
            FROM evento
            WHERE evento.Nome LIKE :nome';
    $params = [':nome' => '%' . $tipo_evento . '%'];

    // Aggiungere condizioni in base ai parametri
    if($evento_online){
        $sql .= ' AND evento.NPosti = -1';
    }else{
        $sql .= ' AND evento.Luogo LIKE :luogo
                  AND evento.NPosti > 0';
        $params[':luogo'] = '%' . $luogo_evento . '%';
    }
    if(isset($data_tempo_evento)){
        $sql .= ' AND evento.Data >= :tempo';
        $params[':tempo'] = $data_tempo_evento;
    }
    $sql .= ' AND evento.Stato != 3;';
    // echo "<br> QUERY: ".$sql."<br>";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $eventi = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // var_dump($params);
    // var_dump($sql);
    if(count($eventi) == 0){
        die("Nessun evento trovato con questi particolari...");
    }

    // Assumiamo che $eventi contenga i risultati della query
    foreach ($eventi as $evento) {
        // Accesso ai valori per ogni evento
        $id = $evento['IDEvento'];
        $nome = $evento['Nome'];
        $luogo = $evento['Luogo'];
        $nPosti = $evento['NPosti'];
        $descrizione = $evento['Descrizione'];
        $data = $evento['Data'];
        $stato = $evento['Stato'];
        
        // Puoi usarli come vuoi, ad esempio:
        switch ($user_role){
            case 'operatore':
                echo "<form action='".$url_creazione."' method='post'>";
                break;
            case 'no-role':
                echo "<form action='login.php?url=".$_SERVER['SCRIPT_NAME']."' method='post'>";
                echo "<br>".$_SERVER['SCRIPT_NAME']."<br>";
                break;
            default:
                echo "<form action='".$url_partecipazione."' method='post'>";
                break;
        }
        
        echo "<h2 name='event_nome'>$nome</h2>
        <p name='event_luogo'>Luogo: $luogo</p>
        <p name='event_nPosti'>Posti disponibili: " . ($nPosti == -1 ? "Illimitati" : $nPosti) . "</p>
        <p name='event_descrizione'>Descrizione: $descrizione</p>
        <p name='event_data'>Data: $data</p>
        <p>Stato: " . statoToString($stato) . "</p>
        <input type='text' name='event_segnalazione' placeholder='Eventuali segnalazioni...'> 
        <input type='hidden' name='event_id' value='$id'>";
        switch ($user_role){
            case 'operatore':
                echo "<button type='submit'>PARTECIPA ALL`EVENTO!</button>";
                break;
            case 'no-role':
                echo "<button type='submit'>PRIMA ACCEDI MONELLO</button>";
                break;
            default:
            echo "<button type='submit'>REGISTRATI ALL`EVENTO!</button>";
                break;
        }
        echo "</form>";
    }
    // Close connection
    unset($pdo);
}catch(PDOException $e){
    die("ERROR: Could not able to execute $sql." . $e->getMessage());
}

?>


