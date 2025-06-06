const { body } = require('express-validator');
const { capitalizeWords } = require('../../utils/capitalizeWordOfString')

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

    body('dataNascita')
        .optional()
        .isDate().withMessage('Data non valida'),

    body('email')
        .trim()
        .isEmail().withMessage('Email non valida')
        .normalizeEmail()
        .customSanitizer(email => email.toLowerCase()),

    body('indirizzo')
        .optional()
        .trim(),

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
]
module.exports = { validateRegisterUser, validateLoginUser, validateModifyUser, validatePasswordUser, validateState } 