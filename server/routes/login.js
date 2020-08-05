const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Google
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

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
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    ); // 1h

    res.json({
      ok: true,
      usuario: usuarioDB,
      token,
    });
  });
});

// Configuraciones de Google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  return {
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}

app.post("/google", async (req, res) => {
  const token = req.body.idtoken;

  //* Validamos token de goggle
  const googleUser = await verify(token).catch((err) => {
    return res.status(403).json({
      ok: false,
      err,
    });
  });

  //* Buscamos usuario
  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    //! Error al buscar usuario
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    // * Validamos tipo de autenticacion del usuario o existente

    if (usuarioDB) {
      //! Usuario con autenticacion local
      if (usuarioDB.google === false) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Debe de usar su autenticacion normal",
          },
        });
      } else {
        // * Renovamos Token
        const token = jwt.sign(
          {
            usuario: usuarioDB,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        return res.json({
          ok: true,
          usuario: usuarioDB,
          token,
        });
      }
    } else {
      // * Usuario no existe, lo creamos
      const usuario = new Usuario();

      usuario.nombre = googleUser.name;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ":)";

      usuario.save((err, usuarioDB) => {
        // ! Error al guardar
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

        const token = jwt.sign(
          {
            usuario: usuarioDB,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        ); // 1h

        res.json({
          ok: true,
          usuario: usuarioDB,
          token,
        });
      });
    }
  });
});

module.exports = app;
