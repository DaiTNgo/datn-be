const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Sensor = new Schema(
  {
    order: Number,
    status: Boolean,
  },
  {
    timestamps: {
      createdAt: false,
      updatedAt: false,
    },
  }
);
module.exports = mongoose.model('sensor', Sensor);
/*
 * xe di vao => uid
 * xe di vao o => sensor => on / off
 * xe di ra 0 => sensor => on / off
 * di ra cong => uid => tinh tien + tong thoi gian do xe + thoi gian vao
 */

// if inputString.includes(sensor) == true => url+ sensor car;
// if(inputString.includes(sensor) == true) => url + 'sensor';
// else url+'car'
// {
//dataUrl = 'sensor'
// }
