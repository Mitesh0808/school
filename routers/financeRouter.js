const express = require("express");
const router = express.Router();
const { authMiddleware, AccessTokenGenerate } = require("../middleware/auth");

const {
  getAllFinance,
  createFinance,
  getFinance,
  updateFinance,
  deleteFinance,
  authUser,
  disableFinance,
  logout,
} = require("../controllers/financeController");
router
  .route("/")
  .get(authMiddleware, AccessTokenGenerate, getAllFinance)
  .post(authMiddleware, AccessTokenGenerate, createFinance);
router
  .route("/:id")
  .get(authMiddleware, AccessTokenGenerate, getFinance)
  .patch(authMiddleware, AccessTokenGenerate, updateFinance)
  .delete(authMiddleware, AccessTokenGenerate, deleteFinance);
router.put("/disable/:id", authMiddleware, AccessTokenGenerate, disableFinance);
router.post("/login", authUser);
router.post("/logout", logout);
module.exports = router;
