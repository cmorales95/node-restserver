const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const rolesValidos = {
	values: ['ADMIN_ROLE', 'USER_ROLE'],
	message: '{VALUE} no es un rol válido',
};

const usuarioSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
	},
	email: {
		type: String,
		required: [true, 'El correo es obligatorio'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'La contraseña es obligatoria'],
	},
	img: {
		type: String,
		required: false,
	},
	rol: {
		type: String,
		default: 'USER_ROLE',
		enum: rolesValidos,
	},
	estado: {
		type: Boolean,
		default: true,
	},
	google: {
		type: Boolean,
		default: false,
	},
});

// Modificar metodos
usuarioSchema.methods.toJSON = function () {
	let user = this;
	let userObject = user.toObject();
	delete userObject.password;

	return userObject;
};

// Plugins
usuarioSchema.plugin(uniqueValidator, {
	message: '{PATH} debe de ser único',
});

module.exports = mongoose.model('Usuario', usuarioSchema);
