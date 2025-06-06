const express = require('express')
const router = express.Router()
const {
    validateInfoEvent,
    validateStateEvent } = require('../middlewares/validate/validateEvent');
const { validationResult } = require('express-validator');

const { Events } = require('../models')
const { constants, sendResponse } = require('../utils')
require('dotenv').config()
const { validateToken } = require('../middlewares/AuthMiddleware');
const requireRole = require('../middlewares/requiredRole')
const { Op } = require("sequelize");

/**
 * @description Create an event
 * @route POST /event/
 * @access private
 */
router.post('/', validateInfoEvent, validateToken, requireRole('admin', 'operatore'), async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Dati non validi', errors.array())
        }

        const sanitizedData = req.body;

        // Aggiungo il campo stato: 
        sanitizedData.stato = 0
        const updatedEvent = await Events.create({
            nome: sanitizedData.nome,
            luogo: sanitizedData.luogo,
            posti: sanitizedData.posti,
            descrizione: sanitizedData.descrizione,
            data: sanitizedData.data,
            stato: sanitizedData.stato
        })

        if (!updatedEvent) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore nella creazione dell\'evento')
        }

        sendResponse(res, constants.RESOURCE_CREATED, true, 'Evento creato con successo', updatedEvent)
    } catch (err) {
        console.error('Errore nella POST /event: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})

/**
 * @description Get all events from one city
 * @route GET /event/city/:city
 * @access public
 */
router.get('/city/:city', async (req, res, next) => {
    const citta = req.params.city

    try {
        const InfoEvents = await Events.findAll({
            where: {
                luogo: {
                    [Op.like]: `%${citta}`
                }
            }
        });

        if (!InfoEvents) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore nella richiesta degli eventi')
        }
        sendResponse(res, constants.OK, true, 'Elenco eventi in città', InfoEvents)
    } catch (err) {
        console.error('Errore nella GET /city/:city: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})

/**
 * @description Modify status Event
 * @route PUT /event/modify/status
 * @access private
 * @note Only Admin or Operator
 */
router.put('/modify/state', validateStateEvent, validateToken, requireRole('admin', 'operatore'), async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Dati non validi', errors.array())
        }

        const { stato, id } = req.body

        const updatedEvent = await Events.update({
            stato: stato,
        }, { where: { id: id } })

        if (!updatedEvent) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore nella modifica dell\'evento')
        }

        sendResponse(res, constants.RESOURCE_CREATED, true, 'Evento modificato con successo')
    } catch (err) {
        console.error('Errore nella PUT /event: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})

/**
 * @description Modify info Event
 * @route PUT /event/modify/:id
 * @access private
 * @note Only Admin or Operator
 */
router.put('/modify/:id', validateInfoEvent, validateToken, requireRole('admin', 'operatore'), async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Dati non validi', errors.array())
        }

        const id = req.params.id
        const sanitizedData = req.body;

        const updatedEvent = await Events.update({
            nome: sanitizedData.nome,
            luogo: sanitizedData.luogo,
            posti: sanitizedData.posti,
            descrizione: sanitizedData.descrizione,
            data: sanitizedData.data
        }, { where: { id: id } })

        if (!updatedEvent) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore nella modifica dell\'evento')
        }

        sendResponse(res, constants.RESOURCE_CREATED, true, 'Evento modificato con successo')
    } catch (err) {
        console.error('Errore nella POST /event: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }

})


/**
 * @description Delete Event
 * @route DELETE /event/:id
 * @access private
 * @note Only Admin or Operator
 */
router.delete('/:id', validateToken, requireRole('admin', 'operatore'), async (req, res, next) => {
    try {

        const id = req.params.id
        const deleted = await Users.destroy({
            where: {
                id: req.user.id
            }
        });

        if (deleted === 0) {
            return res.status(constants.NOT_FOUND).json({ success: false, message: "Evento non trovato." });
        }

        return res.status(constants.OK).json({ success: true, message: "Evento deleted successfully." });
    } catch (err) {
        console.error("Errore DELETE /event/:", err);
        return sendResponse(res, constants.SERVER_ERROR, false, "Internal server error");
    }
})
module.exports = router