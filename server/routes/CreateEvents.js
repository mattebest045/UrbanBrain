const express = require('express')
const router = express.Router()
const { validateInfoCreateEvent } = require('../middlewares/validate/validateCreateEvent');
const { validationResult } = require('express-validator');

const { Events } = require('../models')
const { constants, sendResponse } = require('../utils')
require('dotenv').config()
const { validateToken } = require('../middlewares/AuthMiddleware');
const requireRole = require('../middlewares/requiredRole')
const { Op } = require("sequelize");

/**
 * @description Operator Joins into Event already Created
 * @route POST /createEvent/
 * @access private
 * @note only Operator 
 */
router.post('/', validateToken, requireRole('operatore'), validateInfoCreateEvent, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Dati non validi', errors.array())
        }

        const { idUtente, idEvento, segnalazione } = req.body

        // Controllo se esiste l'id evento esiste
        const checkEvento = Events.findByPk(idEvento)
        if (!checkEvento) return sendResponse(res, constants.BAD_REQUEST, false, 'Evento selezionato inesistente')

        sendResponse(res, constants.RESOURCE_CREATED, true, 'Operatore aggiunto all\'evento correttamente')
    } catch (err) {
        console.error('Errore nella POST /create-event: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})



module.exports = router