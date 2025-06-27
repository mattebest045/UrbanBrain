const express = require('express')
const router = express.Router()
const { validateInfoEvent, validateIdEventParam } = require('../middlewares/validate/validateCreateJoinEvent');
const { validationResult } = require('express-validator');
const { CreateEvents } = require('../models')
const { constants, sendResponse } = require('../utils')
require('dotenv').config()
const { validateToken } = require('../middlewares/AuthMiddleware');
const requireRole = require('../middlewares/requiredRole')

/**
 * @description Modify an event
 * @route PUT /createEvent/:id
 * @access private
 * @note only Operator who's created this event
 */
router.put('/', validateToken, requireRole('operatore'), validateInfoEvent, async (req, res, next) => {
    try {
        const { idUtente, idEvento, segnalazione } = req.body

        // Controllo se esiste l'id evento esiste
        const checkEvento = Events.findByPk(idEvento)
        if (!checkEvento) return sendResponse(res, constants.BAD_REQUEST, false, 'Evento selezionato inesistente')

        const newCreatedEvent = await CreateEvents.create({
            idEvento: idEvento,
            idUtente: idUtente,
            segnalazione: segnalazione
        })

        if (!newCreatedEvent) return sendResponse(res, constants.BAD_REQUEST, false, 'Errore nell\'aggiunta dell\'evento')

        sendResponse(res, constants.RESOURCE_CREATED, true, 'Operatore aggiunto all\'evento correttamente')
    } catch (err) {
        console.error('Errore nella POST /create-event: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})

/**
 * @description Operator Joins into Event already Created
 * @route POST /createEvent/:id
 * @access private
 * @note only Operator 
 */
router.post('/:id', validateToken, validateIdEventParam, requireRole('operatore'), validateInfoEvent, async (req, res, next) => {
    try {
        const { idUtente } = req.user.idUtente
        const { idEvento } = req.params.id

        const { segnalazione } = req.body

        // Controllo se esiste l'id evento esiste
        const checkEvento = Events.findByPk(idEvento)
        if (!checkEvento) return sendResponse(res, constants.BAD_REQUEST, false, 'Evento selezionato inesistente')

        const newCreatedEvent = await CreateEvents.create({
            idEvento,
            idUtente,
            segnalazione
        });

        if (!newCreatedEvent) return sendResponse(res, constants.BAD_REQUEST, false, 'Errore nell\'aggiunta dell\'evento')

        sendResponse(res, constants.RESOURCE_CREATED, true, 'Operatore aggiunto all\'evento correttamente')
    } catch (err) {
        console.error('Errore nella POST /create-event: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})

/**
 * @description Operator no longer participates in the event
 * @route DELETE /createEvent/:id
 * @access private
 */
router.delete('/:id', validateToken, validateIdEventParam, requireRole('operatore'), async (req, res) => {
    try {
        const id = req.params.id
        const deleted = await CreateEvents.destroy({
            where: {
                id: id
            }
        });

        if (deleted === 0) {
            return res.status(constants.NOT_FOUND).json({ success: false, message: "Non lavoravi a questo evento." });
        }

        return res.status(constants.OK).json({ success: true, message: "Non partecipi più all'evento." });
    } catch (err) {
        console.error("Errore DELETE /create-event/:", err);
        return sendResponse(res, constants.SERVER_ERROR, false, "Internal server error");
    }
})

module.exports = router