const asyncHandler = require("express-async-handler");
const { Inquiry } = require("../model");
const { StatusCodes } = require("http-status-codes");
const { idValidator } = require("../validation");

//school,firstName,lastName,email,subject,message
const {
  inquiryCreateValidator,
  inquiryUpdateValidator,
} = require("../validation/inquiryValidator");

const getAllInquiry = asyncHandler(async (req, res) => {
  try {
    const inquirys = await Inquiry.aggregate([
      {
        $lookup: {
          from: "schools",
          localField: "school",
          foreignField: "_id",
          as: "school",
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          subject: 1,
          message: 1,
          school: {
            _id: 1,
            schoolName: 1,
          },
        },
      },
    ]);
    res.status(StatusCodes.OK).send(inquirys);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching all Inquiry");
  }
});
const createInquiry = asyncHandler(async (req, res) => {
  const { error, value } = inquiryCreateValidator(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
  } else {
    try {
      const inquiry = await Inquiry.create(value);
      res.status(StatusCodes.CREATED).json(inquiry);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while creating inquiry");
    }
  }
});
const getInquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = idValidator({ id });
  if (error) {
    res.status(400).send(error);
    return;
  }
  try {
    const inquiry = await Inquiry.findById(id);
    res.status(StatusCodes.OK).send(inquiry);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching  inquiry");
  }
});
const updateInquiry = asyncHandler(async (req, res) => {
  const { error, value } = inquiryUpdateValidator(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
  }
  const { id } = req.params;

  try {
    const updatedInquiry = await Inquiry.findOneAndUpdate({ _id: id }, value, {
      new: true,
      runValidators: true,
    });
    res.status(StatusCodes.OK).send(updatedInquiry);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while updating inquiry");
  }
});
const deleteInquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) {
      res.status(StatusCodes.NOT_FOUND).send("Inquiry not found");
      return;
    }
    res.status(StatusCodes.OK).send("Inquiry deleted successfully");
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while deleting Inquiry");
  }
});
const disableInquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Inquiry.findOneAndUpdate(
      { _id: id },
      { isActive: false },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(StatusCodes.OK).send("Faculty is disabled");
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error ocuured while Faculty is disabled");
  }
});

module.exports = {
  getAllInquiry,
  createInquiry,
  getInquiry,
  updateInquiry,
  deleteInquiry,
  disableInquiry,
};
