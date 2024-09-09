const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin"); // Ensure the path is correct
const cors = require('cors'); // นำเข้า cors

require('dotenv').config();

// Register
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ username, email, password: hashedPassword });
        await admin.save(); // Save the admin instance
        res.status(201).send("Admin registered");
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    /*การแยกโครงสร้างusernameและpasswordจากเนื้อหาคำขอ เหล่านี้เป็นข้อมูลรับรองที่ผู้ใช้ให้มาเมื่อพยายามเข้าสู่ระบบ */
    try {
        const admins = await Admin.findOne({ email });//ใช้User.findOne()ค้นหาผู้ใช้ด้วยคำที่usernameกำหนด
        if (!admins) return res.status(400).send("Admin not found");//ไม่พบผู้ดูแลระบบ
                const isMatch = await bcrypt.compare(password, admins.password);
        if (!isMatch) return res.status(400).send("Invalid credentials")
            //ถ้าไม่เจอชื่อผู้ใช้และรหัสผ่าน ให้ขึ้น 400;

        const admin = await  Admin.findOne({email}).select("-password");//ไม่ให้ส่งpassword กลับมา

        const accessToken = jwt.sign(
            { adminId: admins._id },
            process.env.ACCESS_TOKEN_SELECT,//process.env.ACCESS_TOKEN_SECRETคือคีย์ลับที่ใช้ในการลงนามโทเค็น
            { expiresIn: "1h" }//expiresInจะตั้งเวลาหมดอายุของโทเค็นเป็น 5 นาที
        );

        const refreshToken = jwt.sign(
            { adminId: admins._id },
            process.env.REFRESH_TOKEN_SELECT
            /*process.env.REFRESH_TOKEN_SECRETใช้ในการลงนามโทเค็นนี้
            สร้างโทเค็นการรีเฟรชในลักษณะเดียวกับโทเค็นการเข้าถึง 
            แต่ไม่มีการกำหนดเวลาหมดอายุ (หรือใช้เวลาหมดอายุที่แตกต่างกัน) */
        );
        res.json({admin,accessToken, refreshToken });//ตอบสนองด้วยวัตถุ JSON ที่มีทั้งโทเค็นการเข้าถึงและการรีเฟรช
    } catch (err) {//ตรวจสอบข้อผิดพลาดต่างๆ ที่เกิดขึ้นในระหว่างกระบวนการเข้าสู่ระบบ 
        res.status(500).send(err.message);
    }
};

// Refresh
exports.refresh = async (req, res) => {
    const { token } = req.body;//ยกเลิกโครงสร้างtokenจากเนื้อหาคำขอ โทเค็นนี้คาดว่าจะเป็นโทเค็นรีเฟรช
    if (!token) return res.sendStatus(401);//หากไม่ได้ระบุโทเค็นในเนื้อหาคำขอ ให้ตอบกลับด้วย401 Unauthorizedสถานะ ซึ่งบ่งชี้ว่าคำขอไม่มีโทเค็นที่จำเป็น
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, admin) => {
        if (err) return res.status(403).send("access หมดอายุ")//เช็คว่าaccess หมดอายุมั้ย
        
        const accessToken = jwt.sign(
            { adminId: admin.adminId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
            /*หากโทเค็นการรีเฟรชถูกต้อง ให้สร้างโทเค็นการเข้าถึงใหม่
            expiresIn: "15m"กำหนดเวลาหมดอายุของโทเค็นการเข้าถึงเป็น 15 นาที */
        );
        res.json({ accessToken });
    });
};
