const mongoose = require('mongoose');

const schoolsSchema = new mongoose.Schema({
    date: { type: Date, required: true }, //dd/mm/yyyy
    startTime: { type: String, required: true }, // เวลาที่เริ่มต้น เช่น '09:00'
    endTime: { type: String, required: true }, // เวลาที่สิ้นสุด เช่น '17:00'
    school_name: { type: String, required: true },
    district: { type: String, required: true },
    provinc: { type: String, required: true },
    student_count: { type:Number, required: true },
    teacher_name: { type: String, required: true },
    phone_teacher: { type: String, required: true },
    faculty: { type: String, required: true }
}, 
{ timestamps: true, versionKey: false });

module.exports = mongoose.model('School', schoolsSchema);
