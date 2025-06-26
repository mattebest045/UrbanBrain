const { param, validationResult } = require('express-validator');
const { sendResponse, constants } = require('../../utils');

const validateCityParam = [
    param('city')
        .trim()
        .notEmpty().withMessage('La città è obbligatoria')
        .isLength({ min: 2 }).withMessage('Il nome della città è troppo corto')
        .matches(/^[a-zA-ZàèéìòùÀÈÉÌÒÙ\s\-']+$/).withMessage('Il nome della città contiene caratteri non validi'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore di validazione', errors.array());
        }
        next();
    }
];

module.exports = validateCityParam;