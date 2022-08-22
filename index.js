const express = require("express");
const passport = require("passport");
const db = require("./db");
const jwt = require("jsonwebtoken");
require("./passportConfig")(passport);

const app = express();
const PORT = process.env.PORT || "8000";

db.connect();

app.post(
  "/auth/signup",
  passport.authenticate("local-signup", { session: false }),
  (req, res, next) => {
    res.json({
      user: req.user,
    });
  }
);

app.post(
  "/auth/login",
  passport.authenticate("local-login", { session: false }),
  (req, res, next) => {
    jwt.sign(
      { user: req.user },
      "secretKey",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return res.json({
            message: "Failed to login",
            token: null,
          });
        }
        return res.json({
          token,
        });
      }
    );
  }
);

app.get(
  "user/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({ user: req.user });
  }
);

app.listen(PORT, () => {
  console.log(`Server is runing on  port ${PORT}`);
});
