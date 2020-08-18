const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/Usuario');

// functions
const sendError = (res, status, error) => {
	return res.status(status).json({
		ok: false,
		error,
	});
};

const sendJson = (res, status, value) => {
	return res.status(status).json({
		ok: true,
		value,
	});
};

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function (req, res) {
	const tipo = req.params.tipo;
	const id = req.params.id;

	//* Validate files
	if (!req.files || Object.keys(req.files).length === 0) {
		return sendError(res, 400, 'No se ha seleccionado ningun archivo');
	}

	//* Validar tipos
	const tiposValidos = ['productos', 'usuarios'];
	if (tiposValidos.indexOf(tipo) < 0) {
		return sendError(res, 400, {
			message: 'los tipos permitidos son ' + tiposValidos.join(', '),
			tipo,
		});
	}

	//* Gestion de archivos
	const archivo = req.files.archivo;
	const nombreCortado = archivo.name.split('.');
	const extension = nombreCortado[nombreCortado.length - 1];

	// extensiones permitidas
	const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
	if (extensionesValidas.indexOf(extension) < 0) {
		return sendError(res, 400, {
			message:
				'las extensiones permitidas son ' + extensionesValidas.join(', '),
			ext: extension,
		});
	}

	// Cambiando nombre a archivo
	const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

	archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
		if (err) sendError(res, 500, err);
		sendJson(res, 200, 'Imagen subida correctamente');
	});
});

module.exports = app;
