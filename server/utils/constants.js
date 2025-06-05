exports.constants = {
    OK: 200,
    RESOURCE_CREATED: 201,
    REDIRECT: 302,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    VALIDATION_ERROR: 422,
    INVALID_TOKEN: 498, /** Token expired or just invalid */
    REQUIRED_TOKEN: 499,
    SERVER_ERROR: 500,
};

/** LOGIN:
 * - 200: standard
 * - 201: se creo una risorsa (es: sessione salvata in db)
 * - 302: se faccio un dedirect in un'altra page
 * - 401: Se username o password sono errate
 */