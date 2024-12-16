// Funzione per controllare la sessione dell'utente
function checkSession() {
    var url = "php/check_session.php"; // Percorso del file PHP
    var data = {}; // Nessun dato necessario per questa richiesta

    // Richiesta AJAX
    $.ajax({
        url: url,
        method: 'POST', // Usa POST come specificato in precedenza
        data: data,
        success: function (response) {
            console.log(response); // Debug per verificare la risposta del server
            var data = JSON.parse(response); // Converte la stringa JSON in un oggetto JavaScript
            console.log('Value: '+data);
            // Inizio a modificare i vari tag //

            // Seleziona il tag <a> con la classe "custom-btn"
            var loginButton = $(".custom-btn");
            if (loginButton.length !== 0) {
                // Modifica il pulsante in base allo stato della sessione
                if (data.status === "logged_in") {
                    // Utente loggato
                    loginButton.text("Area Utente");
                    loginButton.attr("href", "area_utente.html");
                } else {
                    // Utente non loggato
                    loginButton.text("Login or Signup");
                    loginButton.attr("href", "#offcanvasExample");
                }    
            }

            // Modifico h2 in section 2
            var welcomeName = $(".welcome_name");
            if(welcomeName !== 0){
                welcomeName.text(data['user_Nome'] + ' ' + data['user_Cognome']);
            }
            
        },
        error: function (xhr, status, error) {
            console.error("Errore durante il controllo della sessione:", error);
        }
    });
}

$(document).ready(function () {
    // Esegui il controllo della sessione all'avvio della pagina
    checkSession();
});
