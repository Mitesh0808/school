const express = require("express");
const router = express.Router();
const { authMiddleware, AccessTokenGenerate } = require("../middleware/auth");

const {
  getAllMarketing,
  createMarketing,
  getMarketing,
  updateMarketing,
  deleteMarketing,
  authUser,
  disableMarketing,
  logout,
} = require("../controllers/marketingController");
router
  .route("/")
  .get(authMiddleware, AccessTokenGenerate, getAllMarketing)
  .post(authMiddleware, AccessTokenGenerate, createMarketing);
router.put(
  "/disable/:id",
  authMiddleware,
  AccessTokenGenerate,
  disableMarketing
);
router
  .route("/:id")
  .get(authMiddleware, AccessTokenGenerate, getMarketing)
  .patch(authMiddleware, AccessTokenGenerate, updateMarketing)
  .delete(authMiddleware, AccessTokenGenerate, deleteMarketing);
router.post("/login", authUser);
router.post("/logout", logout);

module.exports = router;
