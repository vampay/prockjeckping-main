const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(//สร้างรูปแบบ Mongoose ใหม่ที่ชื่อuserSchem
    {
    email:{type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    course: { type: String, required: true }
    },
    {Timestamp : true, versionKey : false
        //timestamps: true:เพิ่มฟิลด์ลงในโครงร่างโดยอัตโนมัติcreatedAtซึ่งupdatedAtจะได้รับการอัพเดตโดย Mongoose โดยอัตโนมัติ
        //versionKey: false: ปิดการใช้งาน__vฟิลด์ซึ่งใช้ตามค่าเริ่มต้นเพื่อติดตามเวอร์ชันของเอกสาร 
    }
);
const User = mongoose.model('User',userSchema)
//สร้างแบบจำลอง Mongoose ที่มีชื่อUsersตาม แบบuserSchemaจำลองนี้แสดงUsersคอลเลกชันใน MongoDB

module.exports = User;
//ส่งออกUsersโมเดลเพื่อให้สามารถใช้งานในส่วนอื่นๆ ของแอปพลิเคชัน เช่น ในตัวควบคุมหรือบริการ