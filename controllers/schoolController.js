const asyncHandler = require("express-async-handler");
const { School, Admin, AdminToken, LogHistory } = require("../model");
const { StatusCodes } = require("http-status-codes");
const comparePassword = require("../utils/checkPassword");

const {
  setRefreshTokenCookie,
  setAccessTokenCookie,
  generateRefreshToken,
  generateAccessToken,
} = require("../utils/token");
//isActive,email,schoolName,phoneNo
const {
  schoolCreateValidator,
  schoolUpdateValidator,
} = require("../validation/schoolValidator");
const {
  idValidator,
  loginValidator,
  emailValidator,
} = require("../validation");

const getAllSchool = asyncHandler(async (req, res) => {
  try {
    const schools = await School.find({});
    res.status(StatusCodes.OK).send(schools);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching all School");
  }
});

const createSchool = asyncHandler(async (req, res) => {
  const { error, value } = schoolCreateValidator(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
    return;
  }
  try {
    const school = await School.create(value);
    const admin = await Admin.create({
      school: school._id,
      email: school.email,
    });
    res.status(StatusCodes.CREATED).send(school);
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while creating school");
  }
});
const getSchool = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = idValidator({ id });
  if (error) {
    res.status(400).send(error);
    return;
  }
  try {
    const school = await School.findById(id);
    res.status(StatusCodes.OK).send(school);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching  school");
  }
});
const updateSchool = asyncHandler(async (req, res) => {
  const { error, value } = schoolUpdateValidator(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
    return;
  }
  const { id } = req.params;

  try {
    const updatedSchool = await School.findOneAndUpdate({ _id: id }, value, {
      new: true,
      runValidators: true,
    });
    res.status(StatusCodes.OK).send(updatedSchool);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while updating school");
  }
});
const deleteSchool = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const school = await School.findByIdAndDelete(id);
    if (!school) {
      res.status(StatusCodes.NOT_FOUND).send("School not found");
      return;
    }
    res.status(StatusCodes.OK).send("School deleted successfully");
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while deleting School");
  }
});
const disableSchool = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const school = await School.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    const admin = await Admin.findOneAndUpdate(
      { schoolId: id },
      { isActive: false },
      { new: true }
    );
    res
      .status(StatusCodes.OK)
      .send("School and associated admin disabled successfully");
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while disabling school and associated admin");
  }
});
const authUser = asyncHandler(async (req, res) => {
  const { error, value } = loginValidator(req.body);
  if (error) {
    res.status(400).send(error);
    return;
  }
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    res.status(401).send("Invalid email or password");
    return;
  }
  const isMatch = await comparePassword(password, admin.password);
  if (isMatch) {
    const accessToken = generateAccessToken({
      email: admin.email,
      role: "schoolAdmin",
      Id: admin._id,
    });
    const refreshToken = generateRefreshToken({
      email: admin.email,
      role: "schoolAdmin",
      Id: admin._id,
    });
    const adminToken = await AdminToken.create({
      accessToken,
      refreshToken,
      Id: admin._id,
    });
    const logHistory = await LogHistory.create({
      adminID: admin._id,
      browser: req.headers["sec-ch-ua"],
    });
    setRefreshTokenCookie(res, refreshToken);
    setAccessTokenCookie(res, accessToken);
    res.status(StatusCodes.OK).send({ message: "Login successful" });
  } else {
    res.status(401).send("Invalid email or password");
  }
});

const logout = asyncHandler(async (req, res) => {
  const adminToken = await AdminToken.findOneAndDelete({
    accessToken: req.cookies.accessToken,
  });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logout successful" });
});
const allLogout = asyncHandler(async (req, res) => {
  const adminToken = await AdminToken.deleteMany({ Id: req.decoded.Id });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logout successful" });
});
module.exports = {
  getAllSchool,
  createSchool,
  getSchool,
  updateSchool,
  deleteSchool,
  disableSchool,
  authUser,
  logout,
  allLogout,
};
