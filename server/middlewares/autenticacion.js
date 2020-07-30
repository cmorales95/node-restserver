const jwt = require('jsonwebtoken');

/**
 * Verificar Token
 */

 //* Para middlewares usamos next para continuar con la ejecucion del programa
 exports.verificarToken = (req, res, next) => {
    const token = req.get('Authorization');


    jwt.verify( token, process.env.SEED, (err, decoded) => {
          //! Send error
          if (err) {
              return res.status(401).json({ //* 401 Not Authorized
                  ok: false,
                  err
              });
          }

          //* Retornamos la informacion del usuario
          req.usuario = decoded.usuario;
          next()
    })
 };


 