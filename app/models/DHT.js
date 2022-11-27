const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DHT = new Schema(
    {
      temperature: {
        type: String,
        require: true,
      },
      humidity: {
        type: String,
        require: true,
      },
      createdAt: Date,
    },
    {
      timestamps: {
        createdAt: false,
        updatedAt: false,
      },
    },
);
module.exports = mongoose.model('DHT', DHT);
