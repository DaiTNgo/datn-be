const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const STATUS = require('../utils/rain.constant');

const Rain = new Schema(
    {
      count: Number,
      createdAt: Date,
      timeStart: Date,
      timeEnd: Date,
      totalTime: Number,
    },
    {
      timestamps: {
        createdAt: false,
        updatedAt: false,
      },
    },
);
module.exports = mongoose.model('rain', Rain);
