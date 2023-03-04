const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const { Course } = require("../model");
const {
  courseCreateValidator,
  courseUpdateValidator,
} = require("../validation/courseValidator");
const { idValidator } = require("../validation");

const getAllCourses = asyncHandler(async (req, res) => {
  console.log(req.headers);

  try {
    // const cources = await Course.find({});
    const cources = await Course.aggregate([
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
          courseName: 1,
          description: 1,
          fees: 1,
          duration: 1,
          school: {
            _id: 1,
            schoolName: 1,
          },
        },
      },
    ]);
    res.status(200).send(cources);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching all courses");
  }
});
const createCourse = asyncHandler(async (req, res) => {
  const { error, value } = courseCreateValidator(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
    return;
  }
  try {
    const course = await Course.create(value);
    res.status(StatusCodes.CREATED).json(course);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while creating courses");
  }
});
const getCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = idValidator({ id });
  if (error) {
    res.status(400).send(error);
    return;
  }
  try {
    const cources = await Course.findById(id);
    res.status(StatusCodes.OK).send(cources);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching courses");
  }
});
const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = courseUpdateValidator(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
    return;
  }
  try {
    const updatedCourse = await Course.findOneAndUpdate({ _id: id }, value, {
      new: true,
      runValidators: true,
    });
    res.status(StatusCodes.OK).send(updatedCourse);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching courses");
  }
});
const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const cources = await Course.findByIdAndDelete(id);
    if (!cources) {
      res.status(StatusCodes.NOT_FOUND).send("course not found");
      return;
    }
    res.status(StatusCodes.OK).send("course deleted successfully");
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while deleting course");
  }
});
const disableCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Course.findOneAndUpdate(
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
  getAllCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  disableCourse,
};
