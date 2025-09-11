const constants = require('../utils/constants');

module.exports = (...allowedRoles) => (req, res, next) => {
    const tipo = req.user.tipo;
    if (!allowedRoles.includes(tipo)) {
        const error = new Error('Operazione non permessa');
        error.statusCode = constants.FORBIDDEN;
        return next(error); // ✅ passa al middleware di gestione errori
    }

    next();
};
