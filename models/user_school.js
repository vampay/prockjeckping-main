const mongoose = require('mongoose');
const Schema = mongoose.Schema
ObjectId = Schema.ObjectId
const User_SchoolSchema = new mongoose.Schema({
    SchoolId:{type: Schema.Types.ObjectId, ref: 'School'},
    userId:{type: Schema.Types.ObjectId, ref: 'User'}
},{timestamps:true})

module.exports = user_school = mongoose.model('userschool',User_SchoolSchema);