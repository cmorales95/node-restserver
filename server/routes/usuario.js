const express = require("express");
const app = express();
const Usuario = require("../models/Usuario");

app.get("/usuario", function (req, res) {
  res.json("Hello World To Local Environment!");
});

app.post("/usuario", function (req, res) {
  const { body } = req;
  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: body.password,
    rol: body.rol,
  });

  usuario.save((err, usuarioDB) => {
    //! Error al guardar
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    //* Guardo correctamente
    res.json({
      ok: true,
      usuario: usuarioDB,
    });
    
  });
});

app.put("/usuario/:id", function (req, res) {
  const id = req.params.id;
  res.json({
    id,
  });
});

app.delete("/usuario", function (req, res) {
  res.json("Post usuario");
});

module.exports = app;
