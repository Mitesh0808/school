const express = require("express");
const router = express.Router();

const courseRouter = require("./courseRouter");
const facultyRouter = require("./facultyRouter");
const financeRouter = require("./financeRouter");
const inquiryRouter = require("./inquiryRouter");
const marketingRouter = require("./marketingRouter");
const schoolRouter = require("./schoolRouter");
const seminarRouter = require("./seminarRouter");
const studentRouter = require("./studentRouter");
const superAdminRouter = require("./superAdminRouter");
router.use("/course", courseRouter);
router.use("/faculty", facultyRouter);
router.use("/finance", financeRouter);
router.use("/inquiry", inquiryRouter);
router.use("/marketing", marketingRouter);
router.use("/school", schoolRouter);
router.use("/seminar", seminarRouter);
router.use("/student", studentRouter);
router.use("/superadmin", superAdminRouter);

module.exports = router;
