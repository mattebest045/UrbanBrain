const multer = require('multer');
const path = require('path');

// Configurazione del disco (puoi cambiare la destinazione come vuoi)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/events') // cartella dove salvare i file
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname)) // es: 12345678.png
    }
});

const upload = multer({ storage });

module.exports = upload;
