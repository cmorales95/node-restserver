const express = require('express');
const { verificarToken } = require('../middlewares/autenticacion');
const app = express();
const Producto = require('../models/Producto');

const _ = require('underscore');

// functions
const sendError = (res, status, error) => {
	return res.status(status).json({
		ok: false,
		error,
	});
};

const sendJson = (res, status, usuario) => {
	return res.status(status).json({
		ok: true,
		usuario,
	});
};

app.get('/producto', verificarToken, (req, res) => {
	const desde = Number(req.query.desde) || 0;
	const limite = Number(req.query.limite) || 5;

	Producto.find({ disponible: true })
		.sort('categoria')
		.skip(desde)
		.limit(limite)
		.populate('categoria', 'nombre')
		.populate('usuario', 'nombre')
		.exec((err.productos) => {
			if (err) return sendError(res, 500, err);
			if (!productos) {
				return sendError(res, 404, 'No hay productos disponibles');
			}

			Producto.countDocuments({ disponible: true }, (err, total) => {
				return res.json({
					ok: true,
					producto: productos,
					total,
				});
			});
		});
});

app.get('/producto/:id', verificarToken, (req, res) => {
	const id = req.params.id;
	Producto.findById(id, (err, producto) => {
		if (err) return sendError(res, 500, err);
		if (!producto) return sendError(res, 404, 'Producto no encontrado');
		if (producto.disponible === false)
			return sendError(res, 400, 'Producto no disponible');
		return sendJson(res, 200, producto);
	});
});

app.post('/producto', verificarToken, (req, res) => {
	const body = req.body;
	const producto = new Producto({
		nombre: body.nombre,
		precioUni: body.precioUni,
		descripcion: body.descripcion,
		categoria: body.categoria,
		usuario: req.usuario._id,
	});

	producto.save((err, productoDB) => {
		if (err) return sendError(res, 400, err);
		return sendJson(res, 201, productoDB);
	});
});

app.put('/producto/:id', verificarToken, (req, res) => {
	const id = req.params.id;
	const body = _.pick(req.body, [
		'nombre',
		'precioUno',
		'descripcion',
		'disponible',
		'categoria',
	]);

	Producto.findByIdAndUpdate(
		id,
		body,
		{ new: true, runValidators: true, context: 'query' },
		(err, producto) => {
			if (err) return sendError(res, 500, err);
			return sendJson(res, 200, producto);
		}
	);
});

app.delete('/producto/:id', verificarToken, (req, res) => {
	const id = req.params.id;

	Producto.findByIdAndUpdate(
		id, //! Disabled the product
		{ disponible: false },
		{ new: true, runValidators: true, context: 'query' },
		(err, producto) => {
			if (err) return sendError(res, 500, err);
			if (!producto) return sendError(res, 404, 'Producto no encontrado');
			return sendJson(res, 200, producto);
		}
	);
});

module.exports = app;
