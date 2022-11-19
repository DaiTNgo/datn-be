const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Power = new Schema(
  {
    amp: {
      type: String,
      require: true,
    },
    uid: {
      type: String,
      require: true,
    },
    totalTime: {
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
module.exports = mongoose.model('power', Power);
