const asyncHandler = require("express-async-handler");
const { Student, Admin } = require("../model");
const { StatusCodes } = require("http-status-codes");
const comparePassword = require("../utils/checkPassword");
const { loginValidator, idValidator } = require("../validation");
const {
  setRefreshTokenCookie,
  setAccessTokenCookie,
  generateRefreshToken,
  generateAccessToken,
} = require("../utils/token");

//school,faculty,isActive,firstName,middleName,lastName,email,age,gender
const {
  studentCreateValidator,
  studentUpdateValidator,
} = require("../validation/studentValidator");
const getAllStudent = asyncHandler(async (req, res) => {
  try {
    const students = await Student.aggregate([
      {
        $lookup: {
          from: "schools",
          localField: "school",
          foreignField: "_id",
          as: "school",
        },
      },
      {
        $lookup: {
          from: "faculties",
          localField: "faculty",
          foreignField: "_id",
          as: "faculty",
        },
      },
      {
        $project: {
          isActive: 1,
          firstName: 1,
          middleName: 1,
          lastName: 1,
          email: 1,
          age: 1,
          gender: 1,
          school: {
            _id: 1,
            schoolName: 1,
          },
          faculty: {
            _id: 1,
            fullName: 1,
          },
        },
      },
    ]);
    res.status(StatusCodes.OK).send(students);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching all courses");
  }
});
const createStudent = asyncHandler(async (req, res) => {
  const { error, value } = studentCreateValidator(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST).send("this error from joi validator ");
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
    const student = await Student.create(value);
    res.status(StatusCodes.CREATED).send(student);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while creating seminar");
  }
});
const getStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = idValidator({ id });
  if (error) {
    res.status(400).send(error);
    return;
  }
  try {
    const student = await Student.findById(id);
    res.status(StatusCodes.OK).send(student);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching  school");
  }
});
const updateStudent = asyncHandler(async (req, res) => {
  const { error, value } = studentUpdateValidator(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
    return;
  }
  const { id } = req.params;

  try {
    const student = await Student.findOneAndUpdate({ _id: id }, value, {
      new: true,
      runValidators: true,
    });
    const updatedStudent = await student.save();
    res.status(StatusCodes.OK).send(updatedStudent);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while updating seminar");
  }
});
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      res.status(StatusCodes.NOT_FOUND).send("student not found");
      return;
    }
    res.status(StatusCodes.OK).send("student deleted successfully");
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while deleting student");
  }
});
const authUser = asyncHandler(async (req, res) => {
  const { error, value } = loginValidator(req.body);
  if (error) {
    res.status(400).send(error);
    return;
  }
  const { email, password } = req.body;
  const student = await Student.findOne({ email });
  if (!student) {
    res.status(401).send("Invalid email or password");
    return;
  }
  const isMatch = await comparePassword(password, student.password);
  if (isMatch) {
    const accessToken = generateAccessToken({
      email: student.email,
      role: "student",
    });
    const refreshToken = generateRefreshToken({
      email: student.email,
      role: "student",
    });
    setRefreshTokenCookie(res, refreshToken);
    setAccessTokenCookie(res, accessToken);
    res.status(StatusCodes.OK).send({ message: "Login successful" });
  } else {
    res.status(401).send("Invalid email or password");
  }
});
const disableStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Student.findOneAndUpdate(
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
  getAllStudent,
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  authUser,
  disableStudent,
  logout,
};
