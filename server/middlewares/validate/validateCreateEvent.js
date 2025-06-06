const { body } = require('express-validator');
const { capitalizeWords } = require('../../utils')

const validateInfoCreateEvent = [
    body('idUtente')
        .notEmpty()
        .isInt({ min: 1 }).withMessage('idUtente non valido'),

    body('idEvento')
        .notEmpty()
        .isInt({ min: 1 }).withMessage('idEvento non valido'),

    body('segnalazione')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('La descrizione può avere massimo 1000 caratteri'),
];


module.exports = { validateInfoCreateEvent };