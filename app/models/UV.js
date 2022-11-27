const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UV = new Schema({
      uv: {
        type: String,
        required: true,
      },
      createdAt: Date,
    },
    {
      timestamps: {
        createdAt: false,
        updatedAt: false,
      },
    });

module.exports = mongoose.model('uv', UV);
