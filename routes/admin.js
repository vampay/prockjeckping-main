const express = require("express");
const router = express.Router();

const { register, login, refresh } = require("../controller/adminController");

router.post("/", async (req,res) => {
    res.sendStatus(400);
    //เวลารันเพื่อregister login refresh  ต้อง localhost:3000/api/auth/register 
});

router.post("/register", register);
router.post("/login" , login);
router.post("/refresh" , refresh);//ขอtoken accessมั้ย

module.exports = router;