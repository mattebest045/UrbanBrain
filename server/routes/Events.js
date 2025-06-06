const express = require('express')
const router = express.Router()
const {
    validateInfoEvent,
    validateStateEvent } = require('../middlewares/validate/validateEvent');
const { validationResult } = require('express-validator');

const { Events } = require('../models')
const { constants, sendResponse, generateToken } = require('../utils')
require('dotenv').config()
const { validateToken } = require('../middlewares/AuthMiddleware');
const { Op } = require("sequelize");

/**
 * @description Create an event
 * @route POST /event/
 * @access Private
 */
router.post('/', validateInfoEvent, validateToken, async (req, res, next) => {
    try {
        const errors = validationResult(req);

        // Ricavo Users.tipo per verificare se può eseguire questa query
        const tipo = req.user.tipo
        if (tipo !== 'admin' || tipo !== 'operatore') {
            return sendResponse(res, constants.UNAUTHORIZED, false, 'Operazione non concessa')
        }
        if (!errors.isEmpty()) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Dati non validi', errors.array())
        }

        const sanitizedData = req.body;

        // Aggiungo il campo stato: 
        sanitizedData.stato = 0
        const newEvent = await Events.create({
            nome: sanitizedData.nome,
            luogo: sanitizedData.luogo,
            posti: sanitizedData.posti,
            descrizione: sanitizedData.descrizione,
            data: sanitizedData.data,
            stato: sanitizedData.stato
        })

        if (!newEvent) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore nella creazione dell\'evento')
        }

        sendResponse(res, constants.RESOURCE_CREATED, true, 'Evento creato con successo', newEvent)
    } catch (err) {
        console.error('Errore nella POST /event: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})

/**
 * @description Get all events from one city
 * @route GET /event/city/:city
 * @access Public
 */
router.get("/city/:city", async (req, res, next) => {
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




module.exports = router