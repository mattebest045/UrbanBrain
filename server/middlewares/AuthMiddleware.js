const { verify } = require("jsonwebtoken")
const dotenv = require('dotenv').config()
const { constants, sendResponse } = require('../utils')

const validateToken = (req, res, next) => {
    // Ricavo il token dall'header
    const accessToken = req.header("accessToken")
    // console.log('access Token: ' + accessToken)
    if (!accessToken) return sendResponse(res, constants.UNAUTHORIZED, false, 'Utente non loggato')

    try {
        // Ricavo il payload in chiaro
        const validToken = verify(accessToken, process.env.JWT_STRING)
        req.user = validToken

        if (validToken) {
            return next()
        }
    } catch (err) {
        if (err.name === 'TokenExpiredError')
            return sendResponse(res, constants.INVALID_TOKEN, false, err)
        return sendResponse(res, constants.VALIDATION_ERROR, false, err)
    }
}


module.exports = { validateToken }