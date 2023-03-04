const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  disableCourse,
} = require("../controllers/courseController");
router.route("/").get(getAllCourses).post(createCourse);
router.route("/:id").get(getCourse).patch(updateCourse).delete(deleteCourse);
router.put("/disable/:id", disableCourse);

module.exports = router;
//courseRouter
