const { body, param, validationResult } = require('express-validator');
const { sendResponse, constants } = require('../../utils');


const validateInfoEvent = [
    body('segnalazione')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('La descrizione può avere massimo 1000 caratteri'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore di validazione', errors.array());
        }
        next();
    }
];


const validateIdEventParam = [
    param('id')
        .toInt()
        .customSanitizer(id => parseInt(id, 10)),
    // .isInt().withMessage('L\'ID deve essere un numero intero')

    (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore di validazione', errors.array());
        }
        next();
    }
];

module.exports = { validateInfoEvent, validateIdEventParam };