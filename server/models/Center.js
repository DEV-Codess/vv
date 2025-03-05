const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true }
});

const Center = mongoose.model('Center', centerSchema);
module.exports = Center;
