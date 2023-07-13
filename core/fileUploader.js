const fileUpload = require('express-fileupload');
const path = require('path');

const fileUpload = (req, res) => {
    
    const files = req.files;

    Object.keys(files).forEach(key => {
        const filedir = path.resolve(__dirname, '..');
        const filepath = path.join(filedir, 'files', files[key].name);
        files[key].mv(filepath, (err) => {
            if(err) return res.status(500).json({ status: 'error', message: err })
        })
    })

    return res.json({ status: 'success', message: Object.keys(files).toString() })
}

module.exports = fileUpload;