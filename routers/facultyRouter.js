const express = require("express");
const router = express.Router();
const { authMiddleware, AccessTokenGenerate } = require("../middleware/auth");

const {
  getAllFaculty,
  createFaculty,
  getFaculty,
  updateFaculty,
  deleteFaculty,
  disableFaculty,
  authUser,
  getFacultyBySchoolId,
  logout,
} = require("../controllers/facultyController");
router
  .route("/")
  .get(authMiddleware, AccessTokenGenerate, getAllFaculty)
  .post(authMiddleware, AccessTokenGenerate, createFaculty);
router
  .route("/:id")
  .get(authMiddleware, AccessTokenGenerate, getFaculty)
  .patch(authMiddleware, AccessTokenGenerate, updateFaculty)
  .delete(authMiddleware, AccessTokenGenerate, deleteFaculty);
router.put("/disable/:id", authMiddleware, AccessTokenGenerate, disableFaculty);
router.get(
  "/schoolId/:id",
  authMiddleware,
  AccessTokenGenerate,
  getFacultyBySchoolId
);
router.post("/login", authUser);
router.post("/logout", logout);

module.exports = router;
//faculty/
