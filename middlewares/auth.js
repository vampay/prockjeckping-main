const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send("Access token expired");  // เพิ่ม return เพื่อหยุดไม่ให้ส่ง response ซ้ำ
        }

        req.user = user;
        next(); // ถ้าไม่มี error ให้เรียก next() เพื่อไปยังขั้นตอนถัดไป
    });
}

module.exports = authenticateToken;
