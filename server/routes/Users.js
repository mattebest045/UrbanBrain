const express = require('express')
const {
    validateRegisterUser,
    validateLoginUser,
    validateModifyUser,
    validatePasswordUser,
    validateState } = require('../middlewares/validate/validateUser');
const { validationResult } = require('express-validator');
const router = express.Router()
const { Users } = require('../models')
const { constants, sendResponse, generateToken } = require('../utils')
const bcrypt = require('bcrypt')
require('dotenv').config()
const { validateToken } = require('../middlewares/AuthMiddleware');
const requireRole = require('../middlewares/requiredRole')


/**
 * @description Create new User
 * @route POST /users/
 * @access public
 */
router.post("/", validateRegisterUser, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Dati non validi', errors.array())
        }

        const sanitizedData = req.body;

        const hashedPassword = await bcrypt.hash(sanitizedData.password, Number(process.env.PSW_SALT));

        // Aggiungo anche il campo stato
        sanitizedData.password = hashedPassword
        sanitizedData.stato = 0

        // console.log(sanitizedData)

        const newUser = await Users.create({
            tipo: sanitizedData.tipo,
            nome: sanitizedData.nome,
            cognome: sanitizedData.cognome,
            dataNascita: sanitizedData.dataNascita,
            email: sanitizedData.email,
            indirizzo: sanitizedData.indirizzo,
            password: sanitizedData.password,
            stato: sanitizedData.stato
        })

        if (!newUser) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Errore nella creazione dell\'utente')
        }

        // Dopo aver creato l'utente, genero il jwt
        const accessToken = generateToken({
            id: newUser.id,
            tipo: newUser.tipo,
            nome: newUser.nome,
            cognome: newUser.cognome,
            email: newUser.email
        })

        // console.log("Token: " + accessToken)

        sendResponse(res, constants.RESOURCE_CREATED, true, "Registered Successfully!", { token: accessToken, user: { id: newUser.id, tipo: newUser.tipo, nome: newUser.nome, cognome: newUser.cognome, } })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return sendResponse(res, constants.CONFLICT, false, 'Email già registrata')
        }

        console.error('Errore nella POST /user: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})

/**
 * @description Login
 * @route POST /user/login
 * @access public
 */
router.post("/login", validateLoginUser, async (req, res, next) => {

    try {
        console.log('body: ', req.body)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Dati non validi', errors.array())
        }

        const { email, password } = req.body;

        // Controllo se lo user è presente nel db
        const user = await Users.findOne({
            where: {
                email: email
            }
        })

        // Utilizzo stato 401 per rendere più difficile possibile user enumeration
        if (!user) {
            return sendResponse(res, constants.UNAUTHORIZED, false, 'User Doesn\'t Exist!')
        }

        bcrypt.compare(password, user.password).then((match) => {
            if (!match) return sendResponse(res, constants.UNAUTHORIZED, false, 'Errata combinazione tra email e password')

            // Genero JWT
            const accessToken = generateToken({
                id: user.id,
                tipo: user.tipo,
                nome: user.nome,
                cognome: user.cognome,
                email: user.email
            })
            return sendResponse(res, constants.OK, true, 'You Logged In!!', { token: accessToken, user: { id: user.id, tipo: user.tipo, nome: user.nome, cognome: user.cognome, } })
        })
    } catch (err) {
        console.error('Errore nella POST /user/login: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})

/**
 * @description Get Basic Info from user
 * @route GET /user/basicinfo
 * @access private
 */
router.get("/basicinfo/", validateToken, async (req, res) => {
    try {
        const id = req.user.id
        // Ricavo tutto tranne il campo password perché non mi serve
        const basicInfo = await Users.findByPk(id, {
            attributes: { exclude: ['password'] },
            // Commento la riga perchè da errore e non capisco il motivo
            // include: [CreateEvents, JoinEvents, Reports]
        })
        // console.log(basicInfo)
        if (!basicInfo) {
            return sendResponse(res, constants.NOT_FOUND, false, 'Utente non trovato');
        }

        sendResponse(res, constants.OK, true, "", basicInfo)
    } catch (err) {
        console.error('Errore nella POST /user: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})


/**
 * @description Modify Info User
 * @route PUT /user/modify
 * @access private
 */
router.put('/modify', validateModifyUser, validateToken, async (req, res) => {
    try {
        const id = req.user.id // Se il token è valido, inserisco i dati nel jwt all'interno di req.user
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Dati non validi', errors.array())
        }

        const { nome, cognome, dataNascita, indirizzo } = req.body

        const [updatedRows] = await Users.update({
            nome: nome,
            cognome: cognome,
            dataNascita: dataNascita,
            indirizzo: indirizzo
        }, { where: { id: id } });

        if (updatedRows === 0) {
            return sendResponse(res, constants.NOT_FOUND, false, "Post non trovato o nessuna modifica necessaria.");
        }

        sendResponse(res, constants.OK, true, "Utente aggiornato con successo.");
    } catch (err) {
        console.error('Errore nella PUT /user/modify: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})

/**
 * @description Modify User's password
 * @route PUT /user/modify/password
 * @access private
 */
router.put('/modify/password', validatePasswordUser, validateToken, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse(res, constants.BAD_REQUEST, false, 'Dati non validi', errors.array())
    }

    const { oldPassword, newPassword } = req.body

    try {
        // Controllo se lo user è presente nel db
        const user = await Users.findOne({ where: { id: req.user.id } });
        // Utilizzo stato 401 per rendere più difficile possibile user enumeration
        if (!user) return sendResponse(res, constants.UNAUTHORIZED, false, "User Doesn't Exist!");

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) return sendResponse(res, constants.UNAUTHORIZED, false, "Wrong Old Password Entered!");

        const hashedNewPassword = await bcrypt.hash(newPassword, Number(process.env.PSW_SALT));
        await Users.update({ password: hashedNewPassword }, { where: { id: user.id } });

        return sendResponse(res, constants.OK, true, "Password Updated!");
    } catch (err) {
        console.error("Errore cambio password:", err);
        return sendResponse(res, constants.SERVER_ERROR, false, "Internal server error");
    }
})

/**
 * @description Modify User's state: Only admin can change state of other users, using his email
 * @route PUT /user/modify/state/:id
 * @access private 
 * @note ONLY ADMIN
 * @field stato: 0: stato di attivazione
 *               1: attivo
 *               2: warning
 *               3: bannato
 */
router.put('/modify/by-email/state', validateState, validateToken, requireRole('admin'), async (req, res) => {
    try {
        // 1) validazione express-validator   
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Dati non validi', errors.array())
        }

        // 2) prendo email e nuovo stato dal body
        const { stato, email } = req.body

        // 3) recupero l’utente per email
        const user = await Users.findOne({ where: { email: email }, attributes: { exclude: ['password'] } })
        if (!user) {
            return sendResponse(res, constants.NOT_FOUND, false, 'Utente non trovato');
        }

        // 4) aggiorno lo stato
        const [updatedRows] = await Users.update({
            stato: stato,
        }, { where: { id: user.id } });

        if (updatedRows === 0) {
            return sendResponse(res, constants.NOT_FOUND, false, "Post non trovato o nessuna modifica necessaria.");
        }

        // 5) restituisco l’id e il nuovo stato
        sendResponse(res, constants.OK, true, "", { id: user.id, stato: updatedRows.stato })
    } catch (err) {
        console.error('Errore nella POST /user: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})

/**
 * @description Modify User's state: Only admin can change state of other users, using his id
 * @route PUT /user/modify/state/:id
 * @access private 
 * @note ONLY ADMIN
 * @field stato: 0: stato di attivazione
 *               1: attivo
 *               2: warning
 *               3: bannato
 */
router.put('/modify/:id/state', validateState, validateToken, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, constants.BAD_REQUEST, false, 'Dati non validi', errors.array())
        }

        const tipo = req.user.tipo
        if (tipo !== 'admin') return sendResponse(res, constants.UNAUTHORIZED, false, 'Operazione non permessa.')

        const id = req.params.id
        const { stato } = req.body

        const user = await Users.findByPk(id, { attributes: { exclude: ['password'] } })
        console.log(user)
        if (!user) {
            return sendResponse(res, constants.NOT_FOUND, false, 'Utente non trovato');
        }

        const [updatedRows] = await Users.update({
            stato: stato,
        }, { where: { id: id } });

        if (updatedRows === 0) {
            return sendResponse(res, constants.NOT_FOUND, false, "Post non trovato o nessuna modifica necessaria.");
        }

        sendResponse(res, constants.OK, true, "", { id: id, stato: updatedRows.stato })
    } catch (err) {
        console.error('Errore nella POST /user: ', err)
        sendResponse(res, constants.SERVER_ERROR, false, 'Errore Interno.')
    }
})

/**
 * @description Delete user account
 * @route DELETE /user/
 * @access private
 */
router.delete('/', validateToken, async (req, res) => {
    try {
        const deleted = await Users.destroy({
            where: {
                id: req.user.id
            }
        });

        if (deleted === 0) {
            return res.status(constants.NOT_FOUND).json({ success: false, message: "Utente non trovato." });
        }

        return res.status(constants.OK).json({ success: true, message: "Utente deleted successfully." });
    } catch (err) {
        console.error("Errore DELETE /user/:", err);
        return sendResponse(res, constants.SERVER_ERROR, false, "Internal server error");
    }
})

module.exports = router