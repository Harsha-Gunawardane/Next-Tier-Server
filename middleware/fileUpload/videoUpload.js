const multer = require('multer');
const path = require('path');
const fs = require('fs');

var name = '';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        //make destination folder
        //create unique folder name
        name = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;

        const dir = 'uploads/videos/' + name;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        //make destination from above
        cb(null, file.fieldname + '-' + name + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 500, // Limit file size to 100MB (adjust as needed)
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['video/mp4', 'video/webm']; // List of allowed video formats
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    },
})

module.exports = upload;
