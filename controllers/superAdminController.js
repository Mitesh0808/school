const { SuperAdmin, SuperAdminToken, LogHistory } = require("../model");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const {
  idValidator,
  loginValidator,
  emailValidator,
} = require("../validation");
const comparePassword = require("../utils/checkPassword");

const {
  setRefreshTokenCookie,
  setAccessTokenCookie,
  generateRefreshToken,
  generateAccessToken,
} = require("../utils/token");

const getAllSuperAdmin = asyncHandler(async (req, res) => {
  try {
    const schools = await SuperAdmin.find({});
    res.status(StatusCodes.OK).send(schools);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching all superAdmin");
  }
});
const createSuperAdmin = asyncHandler(async (req, res) => {
  const { error, value } = emailValidator(req.body);
  if (error) {
    res.status(400).send(error);
    return;
  }
  try {
    const superAdmin = await SuperAdmin.create(value);
    res.status(StatusCodes.OK).send(superAdmin);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching  superAdmin");
  }
});
const getSuperAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = idValidator({ id });
  if (error) {
    res.status(400).send(error);
    return;
  }
  try {
    const superAdmin = await SuperAdmin.findById(id);
    res.status(StatusCodes.OK).send(superAdmin);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching  superAdmin");
  }
});
const updateSuperAdmin = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    const updatedMarketing = await SuperAdmin.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(StatusCodes.OK).send(updatedMarketing);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while updating marketing");
  }
});
const deleteSuperAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = idValidator({ id });
  if (error) {
    res.status(400).send(error);
    return;
  }
  try {
    const superAdmin = await SuperAdmin.findByIdAndDelete(id);
    if (!superAdmin) {
      res.status(StatusCodes.NOT_FOUND).send("superAdmin not found");
      return;
    }
    res.status(StatusCodes.OK).send("superAdmin deleted successfully");
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while deleting superAdmin");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { error, value } = loginValidator(req.body);
  if (error) {
    res.status(400).send(error);
    return;
  }
  const { email, password } = req.body;
  const superAdmin = await SuperAdmin.findOne({ email });
  if (!superAdmin) {
    res.status(401).send("Invalid email or password");
    return;
  }
  const isMatch = await comparePassword(password, superAdmin.password);
  if (isMatch) {
    const accessToken = generateAccessToken({
      email: superAdmin.email,
      role: "superAdmin",
      Id: superAdmin._id,
    });
    const refreshToken = generateRefreshToken({
      email: superAdmin.email,
      role: "superAdmin",
      Id: superAdmin._id,
    });
    const adminToken = await SuperAdminToken.create({
      accessToken,
      refreshToken,
      Id: superAdmin._id,
    });
    const logHistory = await LogHistory.create({
      superAdminID: superAdmin._id,
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
  const adminToken = await SuperAdminToken.findOneAndDelete({
    accessToken: req.cookies.accessToken,
  });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logout successful" });
});
const allLogout = asyncHandler(async (req, res) => {
  const adminToken = await SuperAdminToken.deleteMany({ Id: req.decoded.Id });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logout successful" });
});
module.exports = {
  getAllSuperAdmin,
  createSuperAdmin,
  getSuperAdmin,
  updateSuperAdmin,
  deleteSuperAdmin,
  authUser,
  logout,
  allLogout,
};
