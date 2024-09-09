const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");// Corrected from Product to User
const cors = require('cors'); // นำเข้า cors


require('dotenv').config();
//register
exports.register = async (req, res) => {
    const {email,password,name,surname,course } = req.body;
    //บรรทัดนี้จะดึงข้อมูลusername, password, name, และroleจากเนื้อหาคำขอ ( req.body)  ใช้ลงทะเบียน
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        /*ฟังก์ชั่น นี้bcrypt.hash()จะแฮชรหัสผ่านเป็นข้อความธรรมดา
        สัญลักษณ์นี้10แสดงจำนวนรอบของรหัส Salt จะเพิ่มความซับซ้อนให้กับแฮชรหัสผ่านเพื่อเพิ่มความปลอดภัย
        awaitใช้สำหรับจัดการการดำเนินการแฮชรหัสผ่านแบบอะซิงโครนัส */

        const user = new User({email, password : hashedPassword,name,surname,course });
        /*สร้างอินสแตนซ์ ใหม่Userโดยใช้emill, password  และรหัสผ่านแบบแฮช ( hashedPassword) ที่ให้มา*/

        await user.save();//save()ใช้ในการบันทึกเอกสารผู้ใช้ใหม่ลงในฐานข้อมูล
        res.status(201).send("User registered");//หากบันทึกผู้ใช้สำเร็จ201 Createdรหัสสถานะจะถูกส่งไปยังไคลเอนต์พร้อมข้อความ "ผู้ใช้ลงทะเบียนแล้ว"
    } catch (err) {
        res.status(400).send(err.message);//ข้อความแสดงข้อผิดพลาดจะถูกส่งกลับไปยังไคลเอนต์พร้อม400 Bad Requestรหัสสถานะ
    }
};

//login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    /*การแยกโครงสร้างusernameและpasswordจากเนื้อหาคำขอ เหล่านี้เป็นข้อมูลรับรองที่ผู้ใช้ให้มาเมื่อพยายามเข้าสู่ระบบ */
    try {
        const users = await User.findOne({ email });//ใช้User.findOne()ค้นหาผู้ใช้ด้วยคำที่usernameกำหนด
        if (!users) return res.status(400).send("User not found");
        const isMatch = await bcrypt.compare(password, users.password);
        if (!isMatch) return res.status(400).send("Invalid credentials")
            //ถ้าไม่เจอชื่อผู้ใช้และรหัสผ่าน ให้ขึ้น 400;

        const user = await User .findOne({email}).select("-password");//ไม่ให้ส่งpassword กลับมา

        const accessToken = jwt.sign(
            { userId: users._id },
            process.env.ACCESS_TOKEN_SELECT,//process.env.ACCESS_TOKEN_SECRETคือคีย์ลับที่ใช้ในการลงนามโทเค็น
            { expiresIn: "1h" }//expiresInจะตั้งเวลาหมดอายุของโทเค็นเป็น 5 นาที
        );

        const refreshToken = jwt.sign(
            { userId: users._id },
            process.env.REFRESH_TOKEN_SELECT
            /*process.env.REFRESH_TOKEN_SECRETใช้ในการลงนามโทเค็นนี้
            สร้างโทเค็นการรีเฟรชในลักษณะเดียวกับโทเค็นการเข้าถึง 
            แต่ไม่มีการกำหนดเวลาหมดอายุ (หรือใช้เวลาหมดอายุที่แตกต่างกัน) */
        );
        res.json({user,accessToken, refreshToken });//ตอบสนองด้วยวัตถุ JSON ที่มีทั้งโทเค็นการเข้าถึงและการรีเฟรช
    } catch (err) {//ตรวจสอบข้อผิดพลาดต่างๆ ที่เกิดขึ้นในระหว่างกระบวนการเข้าสู่ระบบ 
        res.status(500).send(err.message);
    }
};

// Refresh
exports.refresh = async (req, res) => {
    const { token } = req.body;//ยกเลิกโครงสร้างtokenจากเนื้อหาคำขอ โทเค็นนี้คาดว่าจะเป็นโทเค็นรีเฟรช
    if (!token) return res.sendStatus(401);//หากไม่ได้ระบุโทเค็นในเนื้อหาคำขอ ให้ตอบกลับด้วย401 Unauthorizedสถานะ ซึ่งบ่งชี้ว่าคำขอไม่มีโทเค็นที่จำเป็น
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send("access หมดอายุ")//เช็คว่าaccess หมดอายุมั้ย
        
        const accessToken = jwt.sign(
            { userId: user.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
            /*หากโทเค็นการรีเฟรชถูกต้อง ให้สร้างโทเค็นการเข้าถึงใหม่
            expiresIn: "15m"กำหนดเวลาหมดอายุของโทเค็นการเข้าถึงเป็น 15 นาที */
        );
        res.json({ accessToken });
    });
};
