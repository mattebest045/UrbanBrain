const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurazione del disco (puoi cambiare la destinazione come vuoi)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('------------- MULTER PART ----------------')
        const uploadDir = path.join(__dirname, '../uploads/events');
        console.log(uploadDir)
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        // path.resolve('uploads/events')
        cb(null, uploadDir) // cartella dove salvare i file
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        console.log(uniqueSuffix)
        cb(null, uniqueSuffix + path.extname(file.originalname)) // es: 12345678.png
    }
});

const upload = multer({ storage });

module.exports = upload;
