const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const { getSchool, getSchoolID, postSchool, updateSchool, deleteSchool } = require("../controller/SchoolController");

router.get("/",  getSchool);
router.get("/:id",  getSchoolID);
router.post("/",  postSchool);
router.put("/:id",  updateSchool);
router.delete("/:id",  deleteSchool);

module.exports = router;
