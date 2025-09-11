const express = require('express')
const router = express.Router()
const {
    validateInfoEvent,
    validateStateEvent,
    validateIdEventParam } = require('../middlewares/validate/validateEvent');
const multer = require('multer')
const path = require('path')
const upload = require('../utils/uploads')
const { Events, CreateEvents, JoinEvents } = require('../models')
const { constants, sendResponse } = require('../utils')
require('dotenv').config()
const { validateToken } = require('../middlewares/AuthMiddleware');
const requireRole = require('../middlewares/requiredRole')
const { Op, fn, col } = require("sequelize");

/**
 * @description Create an event and auto-join the creator
 * @route POST /event/
 * @access private
 * @note Only admin or operator
 */
router.post('/', validateToken, requireRole('admin', 'operatore'), upload.single('file'), validateInfoEvent, async (req, res, next) => {
    try {
        const sanitizedData = req.body;
        const file = req.file;
        const filename = file?.filename ?? 'default.jpg';
        const filepath = file?.path ?? path.join('uploads/events', 'default.jpg');
        const organizzatore = req.body.organizzatore ? req.body.organizzatore : req.user.nome + ' ' + req.user.cognome;
        const emailOrganizzatore = req.body.emailOrganizzatore ? req.body.emailOrganizzatore : req.user.email
        // Aggiungo il campo stato: 
        sanitizedData.stato = 0
        // Creo l'evento
        const newEvent = await Events.create({
            titolo: sanitizedData.titolo,
            categoria: sanitizedData.categoria,
            organizzatore: organizzatore,
            emailOrganizzatore: emailOrganizzatore,
            luogo: sanitizedData.luogo,
            postiDisponibili: sanitizedData.postiDisponibili,
            descrizione: sanitizedData.descrizione,
            data: sanitizedData.data,
            stato: sanitizedData.stato,
            prezzo: sanitizedData.prezzo,
            filename: filename,
            path: filepath,
        })

        if (!newEvent) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore nella creazione dell\'evento')
        }

        // Aggiungo chi ha creato l'evento
        const newCreateEvent = await CreateEvents.create({
            idEvento: newEvent.id,
            idUtente: req.user.id,
            segnalazione: `Creato evento ${sanitizedData.titolo}`
        })

        if (!newCreateEvent) return sendResponse(res, constants.BAD_REQUEST, false, 'Errore nell\'aggiunta del creatore dell\'evento')

        sendResponse(res, constants.RESOURCE_CREATED, true, 'Evento creato con successo')
    } catch (err) {
        console.error('Errore nella POST /event: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})

/**
 * @description Modify state Event
 * @route PUT /event/modify/status
 * @access private
 * @note Only Admin or Operator
 */
router.put('/modify/state', validateStateEvent, validateToken, requireRole('admin'), async (req, res, next) => {
    try {
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
                },
                stato: {
                    [Op.or]: [0, 1, 2]
                },
                data: {
                    [Op.gte]: new Date() // Oggi o date future
                }
            },
            include: [
                {
                    model: JoinEvents,
                    attributes: []
                }
            ],
            attributes: {
                include: [
                    [fn('AVG', col('JoinEvents.star')), 'mediaRating']
                ]
            },
            group: ['Events.id'],
            order: [['data', 'ASC']]
        });


        if (!InfoEvents) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore nella richiesta degli eventi')
        }

        InfoEvents.forEach(event => {
            // Imposto come default questa immagine
            event.dataValues.imageUrl = `${process.env.URL_SERVER}/uploads/events/default.png`;
            if (event.filename) {
                // Costruisco l’URL dell’immagine solo se il file esiste
                event.dataValues.imageUrl = `${process.env.URL_SERVER}/uploads/events/${event.filename}`;
            }
        }
        );

        sendResponse(res, constants.OK, true, 'Elenco eventi in città', InfoEvents)
    } catch (err) {
        console.error('Errore nella GET /city/:city: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})


/**
 * @description Get all listed events from an operator or citizen
 * @route GET /event/listed/
 * @access private
 * @note Only operator or citizen or admin 
 */
router.get('/listed', validateToken, requireRole('cittadino', 'operatore', 'admin'), async (req, res, next) => {
    try {
        const idUtente = req.user.id

        let response;
        // Controllo se l'utente è cittadino
        if (req.user.tipo === 'cittadino') {
            // Cerco in JoinEvents
            response = await JoinEvents.findAll({
                where: { idUtente: idUtente },
                include: [{ model: Events }],
                order: [[{ model: Events }, 'data', 'DESC']]
            })
        } else {
            // Cerco in CreateEvents
            response = await CreateEvents.findAll({
                where: { idUtente: idUtente },
                include: [{ model: Events }],
                order: [[{ model: Events }, 'data', 'DESC']]
            })
        }

        if (!response) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore nella modifica dell\'evento')
        }

        const eventi = response.map((entry) => {
            const event = entry.Event;

            const imageUrl = event.filename
                ? `${process.env.URL_SERVER}/uploads/events/${event.filename}`
                : `${process.env.URL_SERVER}/uploads/events/default.png`;
            const star = entry.star;
            const recensione = entry.descrizione;
            return {
                ...event.dataValues,
                imageUrl,
                star,
                recensione
            };
        });
        sendResponse(res, constants.OK, true, 'Eventi inviati con successo', eventi)
    } catch (err) {
        console.error('Errore nella GET /event/listed: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})

/**
 * @description Modify info Event
 * @route PUT /event/modify/:id
 * @access private
 * @note Only Admin or Operator
 */
router.put('/modify/:id', validateToken, validateIdEventParam, validateInfoEvent, requireRole('admin', 'operatore'), async (req, res, next) => {
    try {
        const id = req.params.id
        const sanitizedData = req.body;

        const updatedEvent = await Events.update({
            titolo: sanitizedData.titolo,
            categoria: sanitizedData.categoria,
            data: sanitizedData.data,
            luogo: sanitizedData.luogo,
            prezzo: sanitizedData.prezzo,
            postiDisponibili: sanitizedData.postiDisponibili,
            descrizione: sanitizedData.descrizione,
            organizzatore: sanitizedData.organizzatore,
            emailOrganizzatore: sanitizedData.emailOrganizzatore,
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
 * @description Modify status Event
 * @route PUT /event/:id/status/
 * @access private
 * @note Only Admin 
 */
router.put('/:id/status', validateToken, validateIdEventParam, requireRole('admin'), async (req, res, next) => {
    try {
        const id = req.params.id
        const { stato } = req.body

        const updatedEvent = await Events.update({
            stato: stato,
        }, { where: { id: id } })

        if (!updatedEvent) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore nella modifica dello stato dell\'evento')
        }

        sendResponse(res, constants.RESOURCE_CREATED, true, 'Stato evento modificato con successo')
    } catch (err) {
        console.error('Errore nella PUT /event/:id/status: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})

/**
 * @description Get only one event
 * @route GET /event/:id
 * @access public
 */
router.get('/:id', validateIdEventParam, async (req, res, next) => {
    const id = req.params.id

    try {
        let InfoEvent = await Events.findByPk(id);

        if (!InfoEvent) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore nella richiesta dell\' evento')
        }

        // Imposto come default questa immagine
        InfoEvent.dataValues.imageUrl = `${process.env.URL_SERVER}/uploads/events/default.png`;
        if (InfoEvent.filename) {
            // Costruisco l’URL dell’immagine solo se il file esiste
            InfoEvent.dataValues.imageUrl = `${process.env.URL_SERVER}/uploads/events/${InfoEvent.filename}`;
        }

        sendResponse(res, constants.OK, true, 'Evento singolo', InfoEvent)
    } catch (err) {
        console.error('Errore nella GET /:id : ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})

/**
 * @description Delete Event
 * @route DELETE /event/:id
 * @access private
 * @note Only Admin or Operator
 */
router.delete('/:id', validateToken, validateIdEventParam, requireRole('admin', 'operatore'), async (req, res, next) => {
    try {
        const id = req.params.id
        const deleted = await Events.destroy({
            where: {
                id: id
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