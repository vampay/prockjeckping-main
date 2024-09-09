const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const { getParticipate, getParticipateID, postParticipate, updateParticipate, deleteParticipate,} = require("../controller/participateController");

 router.get("/",  getParticipate);
 router.get("/:id",  getParticipateID);
 router.post("/",  postParticipate);
 router.put("/:id",  updateParticipate);
 router.delete("/:id",  deleteParticipate);



module.exports = router;
