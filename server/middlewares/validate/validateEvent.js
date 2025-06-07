const { body } = require('express-validator');
const { capitalizeWords } = require('../../utils')

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
        .isInt({ min: 1 }).withMessage('Il numero di posti deve essere un intero positivo'),

    body('descrizione')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('La descrizione può avere massimo 1000 caratteri'),

    body('data')
        .notEmpty().withMessage('La data è obbligatoria')
        .isDate().withMessage('La data deve essere in formato valido (YYYY-MM-DD)'),

    body('segnalazione')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('La descrizione può avere massimo 1000 caratteri'),
];


const validateStateEvent = [
    body('id')
        .notEmpty().withMessage('ID è obbligatorio')
        .trim()
        .isInt({ min: 1 }).withMessage('ID Evento non inserito.'),

    body('stato')
        .notEmpty().withMessage('Lo stato è obbligatorio')
        .isInt({ min: 0, max: 3 }).withMessage('Lo stato deve essere un numero tra 0 e 3'),
]
module.exports = { validateInfoEvent, validateStateEvent };