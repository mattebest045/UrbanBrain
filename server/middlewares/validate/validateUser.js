const { body, param } = require('express-validator');
const { sendResponse, constants, capitalizeWords } = require('../../utils');


const validateRegisterUser = [
    body('tipo')
        .trim()
        .notEmpty().withMessage('Il tipo è obbligatorio')
        .customSanitizer(tipo => tipo.toLowerCase())
        .isIn(['admin', 'cittadino', 'operatore']).withMessage('Tipo non valido: deve essere admin, cittadino o operatore'),

    body('nome')
        .trim()
        .notEmpty().withMessage('Il nome è obbligatorio')
        .customSanitizer(capitalizeWords),

    body('cognome')
        .trim()
        .notEmpty().withMessage('Il cognome è obbligatorio')
        .customSanitizer(capitalizeWords),

    body('email')
        .trim()
        .isEmail().withMessage('Email non valida')
        .normalizeEmail()
        .customSanitizer(email => email.toLowerCase()),

    body('password')
        .trim()
        .isLength({ min: 6 }).withMessage('La password deve avere almeno 6 caratteri')
];


const validateLoginUser = [
    body('email')
        .trim()
        .isEmail().withMessage('Email non valida')
        .normalizeEmail()
        .customSanitizer(email => email.toLowerCase()),

    body('password')
        .trim()
        .isLength({ min: 6 }).withMessage('La password deve avere almeno 6 caratteri')
]

const validateModifyUser = [
    body('nome')
        .optional()
        .trim()
        .customSanitizer(capitalizeWords),

    body('cognome')
        .optional()
        .trim()
        .customSanitizer(capitalizeWords),

    body('dataNascita')
        .optional()
        .isDate().withMessage('Data non valida'),

    body('indirizzo')
        .optional()
        .trim(),
]

const validatePasswordUser = [
    body('oldPassword')
        .notEmpty()
        .trim()
        .isLength({ min: 6 }).withMessage('La password deve avere almeno 6 caratteri'),

    body('newPassword')
        .notEmpty()
        .trim()
        .isLength({ min: 6 }).withMessage('La password deve avere almeno 6 caratteri')
]

const validateState = [
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Email non valida')
        .normalizeEmail()
        .customSanitizer(email => email.toLowerCase()),

    body('stato')
        .notEmpty().withMessage('Il campo "stato" è obbligatorio')
        .isInt({ min: 0, max: 3 }).withMessage('Il valore di "stato" deve essere un numero intero tra 0 e 3'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore di validazione', errors.array());
        }
        next();
    }
]

const validateIdUserParam = [
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

module.exports = { validateRegisterUser, validateLoginUser, validateModifyUser, validatePasswordUser, validateState, validateIdUserParam } 