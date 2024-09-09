const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const app = express();
app.use(express.json());

dotenv.config();//บรรทัดนี้โหลดตัวแปรสภาพแวดล้อมจาก.envไฟล์ลงใน ไฟล์
mongoose.connect(process.env.MONGO_DB_URL, {}).then(() => {
    /*บรรทัดนี้พยายามเชื่อมต่อกับฐานข้อมูลMongoDB โดยใช้ Mongoose ซึ่งเป็นไลบรารี ODM  */
    console.log('MongoDB connected');
}).catch(err => console.log(err));

const  participateRoutes = require("./routes/participate");
app.use("/api/participate", participateRoutes);

const  schoolRoutes = require("./routes/school");
app.use("/api/school", schoolRoutes);

const authRoutes = require ("./routes/auth");
app.use("/api/auth", authRoutes);

const adminRoutes = require ("./routes/admin");
app.use("/api/admin", adminRoutes);

//

app.use(express.static(path.join(__dirname, '/pubilc')));

app.get('/',(req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
})

app.get('/Homepage',(req, res) => {
    res.sendFile(path.join(__dirname, '/views/homepage.html'));
})

app.get('/InForm',(req, res) => {
    res.sendFile(path.join(__dirname, '/views/information.html'));
})

app.get('/LoginPage',(req, res) => {
    res.sendFile(path.join(__dirname, '/views/login.html'));
})

app.get('/SignPage',(req, res) => {
    res.sendFile(path.join(__dirname, '/views/register.html'));
})

app.get('/APIPage',(req, res) => {
    res.sendFile(path.join(__dirname, '/views/View_information.html'));
})

app.get('/APIPage_Admin',(req, res) => {
    res.sendFile(path.join(__dirname, '/view_admin/View_information_admin.html'));
})

app.get('/InFormAdmin',(req, res) => {
    res.sendFile(path.join(__dirname, '/view_admin/Information_admin.html'));
})

app.get('/HomepageAdmin',(req, res) => {
    res.sendFile(path.join(__dirname, '/view_admin/homepage_admin.html'));
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on http://localhost:" + PORT ));
