const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Car = new Schema(
  {
    uid: String,
    timeStart: Date,
    exist: Boolean,
  },
  {
    timestamps: {
      createdAt: false,
      updatedAt: false,
    },
  }
);
module.exports = mongoose.model('car', Car);
/*
 * xe di vao => uid
 * xe di vao o => sensor => on / off
 * xe di ra 0 => sensor => on / off
 * di ra cong => uid => tinh tien + tong thoi gian do xe + thoi gian vao
 */
