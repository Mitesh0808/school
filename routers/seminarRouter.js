const express = require("express");
const router = express.Router();
const {
  getAllSeminar,
  createSeminar,
  getSeminar,
  updateSeminar,
  deleteSeminar,
  disableSeminar,
} = require("../controllers/seminarController");
router.route("/").get(getAllSeminar).post(createSeminar);
router.route("/:id").get(getSeminar).patch(updateSeminar).delete(deleteSeminar);
router.put("/disable/:id", disableSeminar);

module.exports = router;
