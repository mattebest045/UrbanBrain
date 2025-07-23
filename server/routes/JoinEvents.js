const express = require('express')
const router = express.Router()
const { validateInfoEvent, validateIdEventParam, validateRateEvent } = require('../middlewares/validate/validateCreateJoinEvent');
const { Events, JoinEvents } = require('../models')
const { constants, sendResponse } = require('../utils')
require('dotenv').config()
const { validateToken } = require('../middlewares/AuthMiddleware');
const requireRole = require('../middlewares/requiredRole')

/**
 * @description Citizen Join into Event already Created
 * @route POST /join-event/
 * @access private
 * @note only Citizen 
 */
router.post('/', validateToken, requireRole('cittadino'), validateInfoEvent, async (req, res, next) => {
    try {
        const idUtente = req.user.id
        const { idEvento, segnalazione } = req.body

        // Controllo se esiste l'id evento esiste
        const checkEvento = Events.findByPk(idEvento)
        if (!checkEvento) return sendResponse(res, constants.BAD_REQUEST, false, 'Evento selezionato inesistente')

        // Controllo se l'utente si è già iscritto a questo evento
        const checkJoinEvento = await JoinEvents.findOne({
            where: {
                idUtente: idUtente,
                idEvento: idEvento
            }
        })
        if (checkJoinEvento) return sendResponse(res, constants.CONFLICT, false, 'Ti sei già iscritto a quest\'evento!!!')

        const newCreatedEvent = await JoinEvents.create({
            idEvento: idEvento,
            idUtente: idUtente,
            segnalazione: segnalazione
        });

        if (!newCreatedEvent) return sendResponse(res, constants.BAD_REQUEST, false, 'Errore nell\'aggiunta dell\'evento')

        sendResponse(res, constants.RESOURCE_CREATED, true, 'Operatore aggiunto all\'evento correttamente')
    } catch (err) {
        console.error('Errore nella POST /create-event: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})


/**
 * @description Modify an event
 * @route PUT /join-event/
 * @access private
 * @note only Operator who's created this event
 */
router.put('/', validateToken, requireRole('operatore'), validateInfoEvent, async (req, res, next) => {
    try {
        const { idUtente, idEvento, segnalazione } = req.body

        // Controllo se esiste l'id evento esiste
        const checkEvento = Events.findByPk(idEvento)
        if (!checkEvento) return sendResponse(res, constants.BAD_REQUEST, false, 'Evento selezionato inesistente')

        const newCreatedEvent = await JoinEvents.update({
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
 * @description Add/Update rating of an event
 * @route PUT /join-event/rate/:id
 * @access private
 * @note Only citizen
 */
router.put('/rate/:idEvento', validateToken, requireRole('cittadino'), validateRateEvent, async (req, res, next) => {
    try {
        const { recensione, star } = req.body
        const idEvento = req.params.idEvento
        const idUtente = req.user.id

        console.log(recensione, star, idEvento, idUtente)
        // Controllo se esiste l'id evento esiste
        const checkEvento = await Events.findByPk(idEvento)
        if (!checkEvento) return sendResponse(res, constants.BAD_REQUEST, false, 'Evento selezionato inesistente')
        // Controllo se esiste anche la registrazione all'evento
        const checkJoinEvento = await JoinEvents.findOne({
            where: {
                idEvento: idEvento,
                idUtente: idUtente
            }
        })
        if (!checkJoinEvento) return sendResponse(res, constants.BAD_REQUEST, false, 'Non sei davvero registrato a questo evento')
        const updateRecensione = await JoinEvents.update({
            descrizione: recensione,
            star: star
        }, {
            where: {
                idEvento: idEvento,
                idUtente: idUtente
            }
        })
        if (!updateRecensione) return sendResponse(res, constants.BAD_REQUEST, false, 'Errore nell\'aggiunta dell\'evento')

        console.log('updateRecensione: ', updateRecensione)
        sendResponse(res, constants.OK, true, 'Recensione aggiunta corrrettamente')
    } catch (err) {
        console.error('Errore nella POST /create-event: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})

/**
 * @description Operator no longer participates in the event
 * @route DELETE /join-event/:id
 * @access private
 */
router.delete('/:id', validateToken, validateIdEventParam, async (req, res) => {
    try {
        const id = req.params.id
        // Trova l'associazione evento-utente
        const joinEvent = await JoinEvents.findOne({ where: { id: id } });
        if (!joinEvent) {
            return res.status(constants.NOT_FOUND).json({ success: false, message: "Associazione non trovata." });
        }

        // Controlla che sia l'utente stesso a rimuoversi
        if (joinEvent.idUtente !== req.user.id) {
            return res.status(constants.UNAUTHORIZED).json({ success: false, message: "Non puoi modificare questa partecipazione." });
        }

        // Recupera l'evento associato per sapere se è il creatore
        const event = await Events.findByPk(joinEvent.idEvento);
        if (!event) {
            return res.status(constants.NOT_FOUND).json({ success: false, message: "Evento non trovato." });
        }

        // Se è il creatore, elimina l'immagine (solo se non è quella di default)
        if (joinEvent.segnalazione.startsWith('Creatore Evento') && event.filename && event.filename !== 'default.png') {
            const filePath = path.join(__dirname, '..', 'uploads', 'events', event.filename);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.warn("Errore nella rimozione dell'immagine:", err.message);
                } else {
                    console.log("Immagine evento eliminata:", event.filename);
                }
            });
        }

        // Rimuove la riga da joinEvents
        const deleted = await JoinEvents.destroy({ where: { id: id } });

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