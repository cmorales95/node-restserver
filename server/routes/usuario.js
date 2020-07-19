"use strict";
const express = require("express");
const app = express();
const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const _ = require("underscore");

// functions
const sendError = (res, status, error) => {
  return res.status(status).json({
    ok: false,
    error,
  });
};

const sendJson = (res, usuario) => {
  return res.json({
    ok: true,
    usuario,
  });
};

// http require
app.get("/usuario", function (req, res) {
  const desde = Number(req.query.desde) || 0;
  const limite = Number(req.query.limite) || 5;

  Usuario.find({ estado: true }, "nombre email rol google img")
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      //! Error al consultar
      if (err) return sendError(res, 200, err);

      Usuario.count({ estado: true }, (err, total) => {
        res.json({
          ok: true,
          usuarios,
          total,
        });
      });
    });
});

app.post("/usuario", function (req, res) {
  const { body } = req;
  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    rol: body.rol,
  });

  usuario.save((err, usuarioDB) => {
    //! Error al guardar
    if (err) return sendError(res, 200, err);

    //* Guardo correctamente
    sendJson(res, usuarioDB);
  });
});

app.put("/usuario/:id", function (req, res) {
  const id = req.params.id;
  const body = _.pick(req.body, ["nombre", "email", "img", "rol", "estado"]);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true, context: "query" },
    (err, usuarioDB) => {
      //! Error al guardar
      if (err) return sendError(res, 200, err);

      //* Actualizado correctamente
      sendJson(res, usuarioDB);
    }
  );
});

app.delete("/usuario/:id", function (req, res) {
  const { id } = req.params;

  Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true, context: "query" },
    (err, usuarioBorrado) => {
      //! Error al guardar
      if (err) return sendError(res, 200, err);

      //* Actualizado correctamente
      sendJson(res, usuarioBorrado);
    }
  );

  // Eliminacion fisica desactivada
  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  //   //! Error al eliminar
  //   if (err) return sendError(res, 200, err);

  //   //! Alerta de usuario no encontrado
  //   if (usuarioBorrado === null) return sendError(res, 200, 'Usuario no encontrado');

  //   sendJson(res, usuarioBorrado);
  // });
});

module.exports = app;
