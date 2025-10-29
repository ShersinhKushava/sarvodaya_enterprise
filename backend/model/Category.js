// const mongoose = require('mongoose');

// const categorySchema = new mongoose.Schema({
//     name: { type: String, required: true, unique: true },
// }, { timestamps: true });

// module.exports = mongoose.model('Category', categorySchema);


// models/Admin.js
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});



const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
