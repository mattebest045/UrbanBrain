const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const db = require('./models');
const cors = require('cors');
const routerUser = require('./routes/Users')
const routerEvent = require('./routes/Events')
const routerCreateEvent = require('./routes/CreateEvents')
const routerJoinEvent = require('./routes/JoinEvents')
const routerWeather = require('./routes/Weather');
const { constants } = require('./utils');

const port = Number(process.env.SERVER_PORT) || 3001;

const app = express();

app.use(cors([origin = process.env.URL_CLIENT])); // Permette le richieste CORS dal client
app.use(express.json());
app.use('/uploads/events', express.static(path.join(__dirname, 'uploads/events'))); // Rendo pubblica la cartella, così è accessibile

app.use('/user', routerUser)
app.use('/event', routerEvent)
app.use('/create-event', routerCreateEvent)
app.use('/join-event', routerJoinEvent)
app.use('/weather', routerWeather)


app.use((err, req, res, next) => {
    const status = err.statusCode || constants.SERVER_ERROR;
    res.status(status).json({
        success: false,
        message: err.message || 'Errore interno al server',
    });
});

// Creo prima la connessione con il db, sequelize crea eventuali tabelle non presenti nel db che sono presenti nel nostro folder models/
// sync({ alter: true }) solo quando serve -> NB: abilita le modifiche create nella cartella models!
db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
