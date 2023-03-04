const express = require("express");
const router = express.Router();

const {
  getAllInquiry,
  createInquiry,
  getInquiry,
  updateInquiry,
  deleteInquiry,
  disableInquiry,
} = require("../controllers/inquiryController");
router.route("/").get(getAllInquiry).post(createInquiry);
router.route("/:id").get(getInquiry).patch(updateInquiry).delete(deleteInquiry);
router.put("/disable/:id", disableInquiry);

module.exports = router;
