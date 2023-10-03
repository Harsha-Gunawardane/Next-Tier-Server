const multer = require('multer');
const path = require('path');
const fs = require('fs');

var name = '';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        name = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const dir = 'uploads/videos/' + name;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + name + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log(file);
        const allowedMimes = ['video/mp4', 'video/webm']; // List of allowed video formats
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    },
})

const uploadDirect = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        console.log(req.body);
        const allowedMimes = ['video/mp4', 'video/webm']; // List of allowed video formats
        if (allowedMimes.includes(file.mimetype)) {
            console.log(req.files);
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    },
})

module.exports = {
    upload,
    uploadDirect
};
