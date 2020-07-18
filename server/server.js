require("./config/config");
const express = require("express");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// routes
app.use(require('./routes/usuario'));

mongoose.connect('mongodb://localhost:27017/cafe', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((resp) => { console.log('Connected to Mongo!!'); })
  .catch((error) => { console.log('Error connecting to Mongo', error); });

app.listen(process.env.PORT, () => {
  console.log("Escuchando puerto: ", process.env.PORT);
});
