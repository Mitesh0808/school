const asyncHandler = require("express-async-handler");
const { Marketing, Admin } = require("../model");
const comparePassword = require("../utils/checkPassword");
const { StatusCodes } = require("http-status-codes");
const { loginValidator, idValidator } = require("../validation");
const {
  setRefreshTokenCookie,
  setAccessTokenCookie,
  generateRefreshToken,
  generateAccessToken,
} = require("../utils/token");

//isActive,email,school
const {
  marketingCreateValidator,
  marketingUpdateValidator,
} = require("../validation/marketingValidator");

const getAllMarketing = asyncHandler(async (req, res) => {
  try {
    const marketings = await Marketing.aggregate([
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
          email: 1,
          school: {
            _id: 1,
            schoolName: 1,
          },
        },
      },
    ]);
    res.status(StatusCodes.OK).send(marketings);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching all Marketing");
  }
});
const createMarketing = asyncHandler(async (req, res) => {
  const { error, value } = marketingCreateValidator(req.body);
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
    const marketing = await Marketing.create(value);
    res.status(StatusCodes.CREATED).json(marketing);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while creating marketing");
  }
});
const getMarketing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = idValidator({ id });
  if (error) {
    res.status(400).send(error);
    return;
  }
  try {
    const marketing = await Marketing.findById(id);
    res.status(StatusCodes.OK).send(marketing);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching  marketing");
  }
});
const updateMarketing = asyncHandler(async (req, res) => {
  const { error, value } = marketingUpdateValidator(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
    return;
  }
  try {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    const updatedMarketing = await Marketing.findOneAndUpdate(
      { _id: id },
      value,
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
const deleteMarketing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const marketing = await Marketing.findByIdAndDelete(id);
    if (!marketing) {
      res.status(StatusCodes.NOT_FOUND).send("Marketing not found");
      return;
    }
    res.status(StatusCodes.OK).send("Marketing deleted successfully");
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while deleting Marketing");
  }
});
const authUser = asyncHandler(async (req, res) => {
  const { error, value } = loginValidator(req.body);
  if (error) {
    res.status(400).send(error);
    return;
  }
  const { email, password } = req.body;
  const marketing = await Marketing.findOne({ email });
  if (!marketing) {
    res.status(401).send("Invalid email or password");
    return;
  }
  const isMatch = await comparePassword(password, marketing.password);
  if (isMatch) {
    const accessToken = generateAccessToken({
      email: marketing.email,
      role: "marketing",
    });
    const refreshToken = generateRefreshToken({
      email: marketing.email,
      role: "marketing",
    });
    setRefreshTokenCookie(res, refreshToken);
    setAccessTokenCookie(res, accessToken);
    res.status(StatusCodes.OK).send({ message: "Login successful" });
  } else {
    res.status(401).send("Invalid email or password");
  }
});
const disableMarketing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Marketing.findOneAndUpdate(
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
  getAllMarketing,
  createMarketing,
  getMarketing,
  updateMarketing,
  deleteMarketing,
  authUser,
  disableMarketing,
  logout,
};
