// File che uniforma la risposta in tutto il nostro codice
// Utilizzo JSDoc per facilitare il controllo dei tipi dei parametri

/**
 * Invia una riposta HTTP standardizzata al client
 * 
 * @param {import('express').Response} res - L'oggetto Response di Express.
 * @param {number} statusCode - Lo status code HTTP da restituire (es. 200, 400, 500).
 * @param {boolean} success - Indica se la richiesta è andata a buon fine.
 * @param {string} message - Un messaggio descrittivo da inviare al client.
 * @param {any} [data=null] - (Opzionale) Dati aggiuntivi da includere nella risposta.
 * @returns {import('express').Response} La risposta Express inviata al client.
 */

function sendResponse(res, statusCode, success, message, data = null) {
    const responseObject = {
        success,
        message,
    };

    if (data !== null) {
        responseObject.data = data;
    }

    return res.status(statusCode).json(responseObject);
}

module.exports = { sendResponse };
