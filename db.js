const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
require('dotenv').config();
const dbUrl = process.env.DB_LINK;

const connect = async () => {
  mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection;

  db.on("error", () => {
    console.log("could not connect");
  });

  db.once("open", () => {
    console.log("Succesfully connected to database");
  });
};

module.exports = { connect };
