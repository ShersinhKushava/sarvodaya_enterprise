// models/Admin.js
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
  image: {
    type: String,
    default: '',
  },
}, { timestamps: true });



const Admin = mongoose.model("admins", adminSchema);
module.exports = Admin;
