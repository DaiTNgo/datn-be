const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UV = new Schema({
	uv: {
		type: String,
		required: true,
	},
},
{
	timestamps: {
		createdAt: true,
		updatedAt: false,
	},
});

module.exports = mongoose.model('uv', UV);
