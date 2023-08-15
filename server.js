const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3500;

// import custom middleware
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const credentials = require("./middleware/credentials");
const verifyJWT = require("./middleware/verifyJWT");
const fileErrorHandler = require("./middleware/fileUpload/errorHandler");

// import custom files
const corsOptions = require("./config/corsOptions");

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

// serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/send-otp", require("./routes/send-otp"));
app.use("/verify-otp", require("./routes/verify-otp"));
app.use("/forgot-password", require("./routes/reset-password"));

// check authentication of user
app.use(verifyJWT);

app.use("/employees", require("./routes/api/employees"));
app.use("/user", require("./routes/api/user"));
app.use("/notes", require("./routes/api/notes"));
app.use("tutor/staffs", require("./routes/api/tutorStaff"));
app.use("/stu", require("./routes/api/student"));
app.use("/parent", require("./routes/api/parent"));
app.use("/tutor", require("./routes/api/tutor"));

app.all("*", (req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

app.use(fileErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
