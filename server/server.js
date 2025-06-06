const express = require('express');
const dotenv = require('dotenv').config();
const db = require('./models');
const cors = require('cors');
const routerUser = require('./routes/Users')
const routerEvent = require('./routes/Events')

const port = Number(process.env.SERVER_PORT) || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/user', routerUser)
app.use('/event', routerEvent)

// Creo prima la connessione con il db, sequelize crea eventuali tabelle non presenti nel db che sono presenti nel nostro folder models/
// sync({ alter: true }) solo quando serve
db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
