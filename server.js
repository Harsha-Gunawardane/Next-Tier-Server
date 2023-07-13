const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3500;

// import custom middleware
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');

// import custom files
const corsOptions = require('./config/corsOptions');

// custom middleware logger
// app.use(logger);

// check credentials before cors
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// Middleware to parse JSON
app.use(bodyParser.json());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/send-otp', require('./routes/send-otp'));
app.use('/verify-otp', require('./routes/verify-otp'));

// check authentication of user
app.use(verifyJWT);

app.use('/employees', require('./routes/api/employees'));
app.use('/user', require('./routes/api/user'));
app.use('/notes', require('./routes/api/notes'))
app.use("/staff", require("./routes/api/staff"));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
})