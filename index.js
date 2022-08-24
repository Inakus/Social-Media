const express = require("express");
const sesion = require("express-session");
const passport = require("passport");
const moongose = require("mongoose");
const db = require("./db");
const UserModel = require("./userModel");
const cors = require("cors");
const MongoDBStore = require("connect-mongodb-session");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || "8000";
const MAX_AGE = 1000 * 60 * 60 * 3;

const mongoDBstore = new MongoDBStore({
  uri: process.env.DB_LINK,
  collection: 'mySessions',
})

app.use(express.urlencoded({ extended: false }));
app.use(
  sesion({
    secret: process.env.SECRET_KEY,
    name: 'sesion-id',
    store: mongoDBstore,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: MAX_AGE, sameSite: false, secure: false },
  })
);
app.use(cors());
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

db.connect();

app.post("/register", async (req, res) => {
  UserModel.register(
    { username: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) {
        res.json(err);
      } else {
        passport.authenticate("local")(req, res, () => {
          res.json(user);
        });
      }
    }
  );
});

app.post("/login", async (req, res, next) => {
  const user = new UserModel({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, (err) => {
    err
      ? res.json(err)
      : passport.authenticate("local")(req, res, () => {
          const userSession = {}
        });
  });
});

app.get("/test", (req, res) => {
  if (req.isAuthenticated()) {
    const user = UserModel.find();
    res.json(user);
  } else {
    res.json("No autent");
  }
});

app.listen(PORT, () => {
  console.log(`Server is runing on  port ${PORT}`);
});
