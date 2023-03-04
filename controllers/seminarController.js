const asyncHandler = require("express-async-handler");
const { Seminar } = require("../model");
const { StatusCodes } = require("http-status-codes");
//isActive,presenter,description,link,dateTime
const {
  seminarCreateValidator,
  seminarUpdateValidator,
} = require("../validation/seminarValidator");
const { idValidator } = require("../validation");

const getAllSeminar = asyncHandler(async (req, res) => {
  try {
    const seminars = await Seminar.find({});
    res.status(StatusCodes.OK).send(seminars);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching all courses");
  }
});
const createSeminar = asyncHandler(async (req, res) => {
  const { error, value } = seminarCreateValidator(req.body);
  if (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("this error from joi validator ", error);
    return;
  }
  try {
    const seminar = await Seminar.create(value);
    res.status(StatusCodes.CREATED).send(seminar);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while creating seminar");
  }
});
const getSeminar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = idValidator({ id });
  if (error) {
    res.status(400).send(error);
    return;
  }
  try {
    const seminar = await Seminar.findById(id);
    res.status(StatusCodes.OK).send(seminar);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching  seminar");
  }
});
const updateSeminar = asyncHandler(async (req, res) => {
  const { error, value } = seminarUpdateValidator(req.body);
  if (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("this error from joi validator ", error);
    return;
  }
  const { id } = req.params;
  try {
    const updatedSeminar = await Seminar.findOneAndUpdate({ _id: id }, value, {
      new: true,
      runValidators: true,
    });
    res.status(StatusCodes.OK).send(updatedSeminar);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while updating seminar");
  }
});

const deleteSeminar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const seminar = await Seminar.findByIdAndDelete(id);
    if (!seminar) {
      res.status(StatusCodes.NOT_FOUND).send("Seminar not found");
      return;
    }
    res.status(StatusCodes.OK).send("Seminar deleted successfully");
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while deleting seminar");
  }
});
const disableSeminar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Seminar.findOneAndUpdate(
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
  getAllSeminar,
  createSeminar,
  getSeminar,
  updateSeminar,
  deleteSeminar,
  disableSeminar,
};
