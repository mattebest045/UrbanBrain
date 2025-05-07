function extractCity(address) {
    console.log("Indirizzo ricevuto:", address); // Stampa il valore di address per debug
    if (!address || typeof address !== "string") {
        return "";
    }
    const parts = address.split(",");
    return parts.length > 1 ? parts[1].trim() : "";
}


// Funzione per controllare la sessione dell'utente
function checkSession() {
    var url = "../php/check_session"; // Percorso del file PHP
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
                    loginButton.attr("data-bs-toggle", "");
                    loginButton.attr("aria-controls", "");
                } else {
                    // Utente non loggato
                    loginButton.text("Login or Signup");
                    loginButton.attr("href", "#offcanvasExample");
                    loginButton.attr("data-bs-toggle", "offcanvas");
                    loginButton.attr("aria-controls", "offcanvasExample");
                }    
            }

            // Modifico a tag in navbar
            var sensorUrl = $(".nav-sensor-data");
            if(sensorUrl.length !== 0){
                if(data.status === "logged_in"){
                    sensorUrl.attr("href", "dashboard.html");
                }else{
                    sensorUrl.attr("href", "index.html?errore="+encodeURIComponent('Per accedere alla pagina devi prima loggarti!'));
                }
            }

            // Controllo se è registrato per entrare in dashboard.html
            if (window.location.href.includes("UrbanBrain/dashboard.html") && data.status !== "logged_in") {
                const baseUrl = window.location.origin; // Ottiene la base URL dinamicamente
                location.replace(`${baseUrl}/UrbanBrain/index.html?errore=${encodeURIComponent('Per accedere alla pagina devi prima loggarti!')}`);
            }else{
                // modifico il valore della Città in dashboard.html
                var city = document.getElementById('selectWhichCity').innerHTML;
                console.log(city);
                console.log('Indirizzo: '+data.user_Indirizzo);
                console.log('Citta: '+extractCity(data.user_Indirizzo));
                if(city.length !== 0){
                    if(data.user_Indirizzo.length !== 0){
                        
                        city = extractCity(data.user_Indirizzo);
                    }else{
                        city = "Roma";
                    }
                }
            }

            // Controllo se può accedere in area_utente
            if (window.location.href.includes("UrbanBrain/area_utente.html") && data.status !== "logged_in") {
                const baseUrl = window.location.origin; // Ottiene la base URL dinamicamente
                location.replace(`${baseUrl}/UrbanBrain/index.html?errore=${encodeURIComponent('Per accedere alla pagina devi prima loggarti!')}`);
            }


            // Modifico h2 in section 2 zona area_utente
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
