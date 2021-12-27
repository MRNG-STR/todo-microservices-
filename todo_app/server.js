
const express = require("express");
const bodyParser = require("body-parser");
const task = require("./routes/task"); //new addition
const InitiateMongoServer = require("./config/db");
const cron = require("./cron/cron");
// Initiate Mongo Server
InitiateMongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 4001;

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});


/**
 * Router Middleware
 * Router - /user/*
 * Method - *
 */
app.use("/task", task);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
