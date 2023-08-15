const MB = 5 // 5MB
const FILE_SIZE_LIMIT = 1024 * 1024 * MB;

const fileSizeLimitter = (req, res, next) => {
    const files = req.files
    const filesOverLimit = []

    console.log(files)

    Object.keys(files).forEach(key => {
        if (files[key].size > FILE_SIZE_LIMIT) {
            filesOverLimit.push(files[key].name)
        }
    })

    if (filesOverLimit.length) {
        const properVerb = filesOverLimit.length > 1 ? 'are' : 'is';

        const sentence = `Uplooading failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB}.`.replaceAll(',', ', ');

        const message = filesOverLimit.length < 3
            ? sentence.replace(',', ' and')
            : sentence.replace(/,(?=[^,]*$)/, ' and');

        return res.status(413).json({ status: 'error', message: message });
    }

    next()
}
module.exports = fileSizeLimitter;