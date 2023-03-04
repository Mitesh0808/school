const express = require("express");
const router = express.Router();
const {
  getAllStudent,
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  authUser,
  disableStudent,
  logout,
} = require("../controllers/studentController");
const { authMiddleware, AccessTokenGenerate } = require("../middleware/auth");

router
  .route("/")
  .get(authMiddleware, AccessTokenGenerate, getAllStudent)
  .post(authMiddleware, AccessTokenGenerate, createStudent);
router
  .route("/:id")
  .get(authMiddleware, AccessTokenGenerate, getStudent)
  .patch(authMiddleware, AccessTokenGenerate, updateStudent)
  .delete(authMiddleware, AccessTokenGenerate, deleteStudent);
router.put("/disable/:id", authMiddleware, AccessTokenGenerate, disableStudent);
router.post("/login", authUser);
router.post("/logout", logout);

module.exports = router;
