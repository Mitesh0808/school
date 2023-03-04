const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const comparePassword = require("../utils/checkPassword");
const { Faculty, Admin } = require("../model");
const {
  facultyCreateValidator,
  facultyUpdateValidator,
} = require("../validation/facultyValidator");
const {
  setRefreshTokenCookie,
  setAccessTokenCookie,
  generateRefreshToken,
  generateAccessToken,
} = require("../utils/token");

const mongoose = require("mongoose");

//school,isActive,fullName,email,phoneNo
const { loginValidator, idValidator } = require("../validation");

const getAllFaculty = asyncHandler(async (req, res) => {
  try {
    const faculty = await Faculty.aggregate([
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
          isActive: 1,
          fullName: 1,
          email: 1,
          phoneNo: 1,
          school: {
            _id: 1,
            schoolName: 1,
          },
        },
      },
    ]);
    res.status(StatusCodes.OK).send(faculty);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching all Faculty");
  }
});
const createFaculty = asyncHandler(async (req, res) => {
  const { error, value } = facultyCreateValidator(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
    return;
  }
  try {
    const { school } = await Admin.findOne({ email: req.decoded.email }).select(
      {
        school: 1,
        _id: 0,
      }
    );
    value.school = school;
    const faculty = await Faculty.create(value);
    res.status(StatusCodes.OK).json(faculty);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while creating faculty");
    return;
  }
});
const getFaculty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = idValidator({ id });
  if (error) {
    res.status(400).send(error);
    return;
  }
  try {
    const faculty = await Faculty.findById(id);
    res.status(StatusCodes.OK).send(faculty);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching  faculty");
  }
});
const updateFaculty = asyncHandler(async (req, res) => {
  const { error, value } = facultyUpdateValidator(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
    return;
  }
  const { id } = req.params;

  try {
    const updatedFaculty = await Faculty.findOneAndUpdate({ _id: id }, value, {
      new: true,
      runValidators: true,
    });
    res.status(StatusCodes.OK).json(updatedFaculty);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while updating faculty ");
  }
});
const deleteFaculty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Faculty.findByIdAndDelete(id);
    if (!faculty) {
      res.status(StatusCodes.NOT_FOUND).send("Faculty not found");
      return;
    }
    res.status(StatusCodes.OK).send("Faculty deleted successfully");
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while deleting Faculty");
  }
});
const authUser = asyncHandler(async (req, res) => {
  const { error, value } = loginValidator(req.body);
  if (error) {
    res.status(400).send(error);
    return;
  }
  const { email, password } = req.body;
  const faculty = await Faculty.findOne({ email });
  if (!faculty) {
    res.status(401).send("Invalid email or password");
    return;
  }
  const isMatch = await comparePassword(password, faculty.password);
  if (isMatch) {
    const accessToken = generateAccessToken({
      email: faculty.email,
      role: "faculty",
    });
    const refreshToken = generateRefreshToken({
      email: faculty.email,
      role: "faculty",
    });
    setRefreshTokenCookie(res, refreshToken);
    setAccessTokenCookie(res, accessToken);
    res.status(StatusCodes.OK).send({ message: "Login successful" });
  } else {
    res.status(401).send("Invalid email or password");
  }
});
const getFacultyBySchoolId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = idValidator({ id });
  if (error) {
    res.status(400).send(error);
    return;
  }
  try {
    const faculty = await Faculty.find({
      isActive: true,
      school: mongoose.Types.ObjectId(id),
    });
    res.status(StatusCodes.OK).json(faculty);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error ocuured while creating fetching faculty with schoolid");
  }
});
const disableFaculty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Faculty.findOneAndUpdate(
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
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logout successful" });
});

module.exports = {
  getAllFaculty,
  createFaculty,
  getFaculty,
  updateFaculty,
  deleteFaculty,
  authUser,
  getFacultyBySchoolId,
  disableFaculty,
  logout,
};
