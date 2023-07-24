const uploadProfilePicture = (req, res) => {
    console.log(req.files.image);
    if (!req.files || !req.files.image) {
        return res.status(400).json({ error: 'No file content' });
    }

    // Process the uploaded file here

    return res.sendStatus(204);
}

module.exports = {uploadProfilePicture}