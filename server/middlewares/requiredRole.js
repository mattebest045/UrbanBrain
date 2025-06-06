const constants = require('../utils/constants');
const sendResponse = require('../utils/server_response');

module.exports = (...allowedRoles) => (req, res, next) => {
    const tipo = req.user.tipo;
    if (!allowedRoles.includes(tipo)) {
        return sendResponse(res, constants.UNAUTHORIZED, false, 'Operazione non permessa.');
    }
    next();
};
