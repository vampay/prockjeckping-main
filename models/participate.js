const mongoose = require('mongoose');

const participateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    course: { type: String, required: true },
    Boarding_point: { type: String, required: true },
}, 
{ timestamps: true, versionKey: false });

module.exports = mongoose.model('Participate', participateSchema);
