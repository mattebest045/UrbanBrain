const { body, param } = require('express-validator');
const { sendResponse, constants, capitalizeWords } = require('../../utils');

const validateInfoEvent = [
    body('nome')
        .trim()
        .notEmpty().withMessage('Il nome è obbligatorio')
        .isLength({ max: 255 }).withMessage('Il nome può avere massimo 255 caratteri'),

    body('luogo')
        .trim()
        .notEmpty().withMessage('Il luogo è obbligatorio')
        .isLength({ max: 255 }).withMessage('Il luogo può avere massimo 255 caratteri'),

    body('posti')
        .optional()
        .toInt('Il numero deve essere convertito')
        .isInt({ min: 0 }).withMessage('Il numero di posti deve essere un intero positivo'),

    body('descrizione')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('La descrizione può avere massimo 1000 caratteri'),

    body('data')
        .notEmpty().withMessage('La data è obbligatoria')
        .isDate().withMessage('La data deve essere in formato valido (YYYY-MM-DD)'),

    body('prezzo')
        .notEmpty().withMessage('Il prezzo è obbligatorio')
        .toFloat()
        .isFloat({ min: 0, max: 999.99 }).withMessage('Il prezzo deve avere massimo 3 cifre intere e 2 decimali')
        .matches(/^\d{1,3}(\.\d{1,2})?$/).withMessage('Il prezzo deve avere massimo 3 cifre intere e 2 decimali'),

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


const validateStateEvent = [
    body('id')
        .notEmpty().withMessage('ID è obbligatorio')
        .trim()
        .isInt({ min: 1 }).withMessage('ID Evento non inserito.'),

    body('stato')
        .notEmpty().withMessage('Lo stato è obbligatorio')
        .isInt({ min: 0, max: 3 }).withMessage('Lo stato deve essere un numero tra 0 e 3'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore di validazione', errors.array());
        }
        next();
    }
]

const validateIdEventParam = [
    param('id')
        .isInt().withMessage('L\'ID deve essere un numero intero')
        .toInt()
        .customSanitizer(id => parseInt(id, 10)),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore di validazione', errors.array());
        }
        next();
    }
];

module.exports = { validateInfoEvent, validateStateEvent, validateIdEventParam };