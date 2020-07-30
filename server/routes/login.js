const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/Usuario");

const app = express();

app.post("/login", (req, res) => {
  const body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    // ! Error de servidor
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    // ! Usuario no existe
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "(usuario) o contraseña incorrectos",
        },
      });
    }

    // ! Password no es correcto
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "usuario o (contraseña) incorrectos",
        },
      });
    }

    const token = jwt.sign(
      {
        usuario: usuarioDB,
      },
      process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN}
    ); // 1h

    res.json({
      ok: true,
      usuario: usuarioDB,
      token,
    });
  });
});

module.exports = app;
