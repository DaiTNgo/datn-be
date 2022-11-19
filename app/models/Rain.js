const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Rain = new Schema(
  {
    rain: {
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
module.exports = mongoose.model('rain', Rain);
