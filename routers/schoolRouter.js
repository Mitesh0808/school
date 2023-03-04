const express = require("express");
const router = express.Router();
const {
  getAllSchool,
  createSchool,
  getSchool,
  updateSchool,
  deleteSchool,
  disableSchool,
  authUser,
  logout,
  allLogout,
} = require("../controllers/schoolController");
const { authMiddleware, AccessTokenGenerate } = require("../middleware/auth");
router
  .route("/")
  .get(authMiddleware, AccessTokenGenerate, getAllSchool)
  .post(authMiddleware, AccessTokenGenerate, createSchool);
router
  .route("/:id")
  .get(authMiddleware, AccessTokenGenerate, getSchool)
  .patch(authMiddleware, AccessTokenGenerate, updateSchool)
  .delete(authMiddleware, AccessTokenGenerate, deleteSchool);
router.put("/disable/:id", authMiddleware, disableSchool);
router.post("/login", authUser);
router.post("/logout", authMiddleware, AccessTokenGenerate, logout);
router.post("/alllogout", authMiddleware, AccessTokenGenerate, allLogout);
module.exports = router;
