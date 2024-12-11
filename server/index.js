const express = require("express");
const session = require('express-session')
const cookieParser = require('cookie-parser')
const PORT = 5000;
require("dotenv").config();
const router = require("./mvc/router")
require('./strategies/discord')
// cors
const cors = require("cors");
const passport = require("passport");

let corsOptions = {
    origin: "https://buddyrail.com", // prod
    // origin: "http://localhost:3000", 
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
};

const app = express();
app.use(cors(corsOptions)); // middleware for cors
app.use(express.json());    // middleware for json

app.use(session ({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {httpOnly: true, maxAge: 60000 * 60 * 24 },
}))

app.use(passport.initialize())
app.use(passport.session())

// router
app.use('/api', router)


// start
const start = async () => {
  try {
      app.listen
        (
          PORT,
          () => console.log(`server started on port ${PORT}`)
        );
  } catch (e) {
      console.log(e);
  }
};

start();
