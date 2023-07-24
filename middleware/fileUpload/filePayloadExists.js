const filePayloadExists = (req, res, next) => {
  if (!req?.body.files || Object.keys(req?.body.files).length === 0) {
    return res.sendStatus(400);
  }
  next();
};

module.exports = filePayloadExists;
