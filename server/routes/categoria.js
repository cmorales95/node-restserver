const express = require('express');
const app = express();

const Categoria = require('../models/Categoria');
const {
	verificarToken,
	verificarAdmin_Role,
} = require('../middlewares/autenticacion');

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

// Create Category
app.post('/categoria', [verificarToken, verificarAdmin_Role], (req, res) => {
	const body = req.body;
	const categoria = new Categoria({
		nombre: body.nombre,
		usuario_id: req.usuario._id,
	}); //* Creating a new category

	categoria.save((err, usuarioDB) => {
		//! Error saving category
		if (err) return sendError(res, 400, err);

		//* Ok
		sendJson(res, usuarioDB);
	});
});

module.exports = app;

/**
 categorias.get;
 * Mostrar
 *  Categorias: Get
 *  CategoriaPorId: Get
 *  Nueva Categoria: Post
 *  Actualizar Categoria: Put
 *  Eliminar Categoria: Delete (Solo un admin la puede borrar)
 *
 */
