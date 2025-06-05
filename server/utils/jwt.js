// File che gestisce la creazione di un jwt
const { sign } = require('jsonwebtoken');
require('dotenv').config()

/**
 * Genera un token JWT per l'utente autenticato.
 *
 * Il token conterrà alcune informazioni di base sull'utente, come:
 * - id
 * - tipo (es. admin/cittadino/operatore)
 * - nome
 * - cognome
 * - email
 *
 * @param {Object} user - Oggetto utente autenticato.
 * @param {number} user.id - ID univoco dell'utente.
 * @param {string} user.tipo - Tipo dell'utente.
 * @param {string} user.nome - Nome dell'utente.
 * @param {string} user.cognome - Cognome dell'utente.
 * @param {string} user.email - Email dell'utente.
 * @returns {string} Token JWT firmato.
 */

const generateToken = (user) => {
    return sign({
        id: user.id,
        tipo: user.tipo,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email
    }, process.env.JWT_STRING, {
        expiresIn: "15m"
    });
}

module.exports = { generateToken };
