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
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);
module.exports = mongoose.model('DHT', DHT);
