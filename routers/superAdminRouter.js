const express = require("express");
const router = express.Router();
const {
  getAllSuperAdmin,
  createSuperAdmin,
  getSuperAdmin,
  updateSuperAdmin,
  deleteSuperAdmin,
  authUser,
  logout,
  allLogout,
} = require("../controllers/superAdminController");
const { authMiddleware, AccessTokenGenerate } = require("../middleware/auth");

router.route("/").get(getAllSuperAdmin).post(createSuperAdmin);
router
  .route("/:id")
  .get(getSuperAdmin)
  .patch(updateSuperAdmin)
  .delete(deleteSuperAdmin);
router.post("/login", authUser);
router.post("/logout", authMiddleware, AccessTokenGenerate, logout);
router.post("/alllogout", authMiddleware, AccessTokenGenerate, allLogout);
module.exports = router;
