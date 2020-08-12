const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

// Enum Values

// Schema
const categoriaSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'el nombre obligatorio'],
		unique: true,
	},
	usuario_id: {
		type: String,
		required: [true, 'el usuario es obligatorio'],
	},
});

categoriaSchema.methods.toJSON = function () {
	const category = this;
	let categoryObject = category.toObject();
	delete categoryObject.usuario_id;
	return categoryObject;
};

categoriaSchema.plugin(uniqueValidator, {
	message: '{PATH} debe ser único',
});

module.exports = mongoose.model('Categoria', categoriaSchema);
