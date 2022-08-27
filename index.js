require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);


const db = require("./db");
const loginRouter = require("./routes/loginRoutes");

const app = express();

const MAX_AGE = 1000 * 60 * 60 * 3;

const mongoDBstore = new MongoDBStore({
  uri: process.env.DB_LINK,
  collection: "mySesions",
});

const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.DB_SECRET_KEY,
    name: "sesion-id",
    store: mongoDBstore,
    cookie: {
      maxAge: MAX_AGE,
      sameSite: false,
      secure: false,
    },
    resave: true,
    saveUninitialized: false,
  })
);

db.connect();

app.use("/api", loginRouter);

app.listen(port, () => {
  console.log(`Server is runing on port ${port}`);
});

module.exports = app;
