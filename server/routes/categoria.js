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

const sendJson = (res, value) => {
	return res.json({
		ok: true,
		value,
	});
};

// Obtain Categories
app.get('/categoria', verificarToken, (req, res) => {
	//* Load Categories
	Categoria.find({}, 'nombre').exec((err, categorias) => {
		if (err) return sendError(res, 400, err);
		//* Count the rows
		Categoria.count({}, (err, total) => {
			res.json({
				ok: true,
				categorias,
				total,
			});
		});
	});
});

// Obtain a Category
app.get('/categoria/:id', verificarToken, (req, res) => {
	const id = req.params.id;
	Categoria.findById(id, (err, categoria) => {
		console.log(err);
		if (err) return sendError(res, 400, err);
		sendJson(res, categoria);
	});
});

// Create Category
app.post('/categoria', [verificarToken, verificarAdmin_Role], (req, res) => {
	const body = req.body;
	const categoria = new Categoria({
		nombre: body.nombre,
		usuario_id: req.usuario._id,
	}); //* Creating a new category

	categoria.save((err, usuarioDB) => {
		if (err) return sendError(res, 400, err);
		sendJson(res, usuarioDB);
	});
});

app.put('/categoria/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
	const id = req.params.id;
	const nombre = req.body.nombre;
	Categoria.findByIdAndUpdate(
		id,
		{ nombre },
		{ new: true, runValidators: true, context: 'query' },
		(err, categoria) => {
			if (err) return sendError(res, 400, err);
			sendJson(res, categoria);
		}
	);
});

app.delete(
	'/categoria/:id',
	[verificarToken, verificarAdmin_Role],
	(req, res) => {
		const id = req.params.id;
		Categoria.findByIdAndDelete(id, (err, categoria) => {
			if (err) return sendError(res, 400, err);
			sendJson(res, categoria);
		});
	}
);

module.exports = app;
