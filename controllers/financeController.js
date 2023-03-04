const asyncHandler = require("express-async-handler");
const { Finance, Admin } = require("../model");
const { StatusCodes } = require("http-status-codes");
const comparePassword = require("../utils/checkPassword");
const { loginValidator, idValidator } = require("../validation");
const {
  setRefreshTokenCookie,
  setAccessTokenCookie,
  generateRefreshToken,
  generateAccessToken,
} = require("../utils/token");

//isActive,email,school
const {
  financeCreateValidator,
  financeUpdateValidator,
} = require("../validation/financeValidator");

const getAllFinance = asyncHandler(async (req, res) => {
  try {
    const finances = await Finance.aggregate([
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
    res.status(StatusCodes.OK).send(finances);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching all Finnace");
  }
});
const createFinance = asyncHandler(async (req, res) => {
  const { error, value } = financeCreateValidator(req.body);
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
    const finance = await Finance.create(value);
    res.status(StatusCodes.CREATED).json(finance);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while creating finance");
  }
});
const getFinance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = idValidator({ id });
  if (error) {
    res.status(400).send(error);
    return;
  }
  try {
    const finance = await Finance.findById(id);
    res.status(StatusCodes.OK).send(finance);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("error occoured while fetching  faculty");
  }
});
const updateFinance = asyncHandler(async (req, res) => {
  const { error, value } = financeUpdateValidator(req.body);
  if (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
    return;
  }
  const { id } = req.params;

  try {
    const updatedFinance = await Finance.findOneAndUpdate({ _id: id }, value, {
      new: true,
      runValidators: true,
    });
    res.status(StatusCodes.OK).send(updatedFinance);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while updating finance");
  }
});
const deleteFinance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const finance = await Finance.findByIdAndDelete(id);
    if (!finance) {
      res.status(StatusCodes.NOT_FOUND).send("Finnace not found");
      return;
    }
    res.status(StatusCodes.OK).send("Finnace deleted successfully");
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("Error occurred while deleting Finnace");
  }
});
const authUser = asyncHandler(async (req, res) => {
  const { error, value } = loginValidator(req.body);
  if (error) {
    res.status(400).send(error);
    return;
  }
  const { email, password } = req.body;
  const finance = await Finance.findOne({ email });
  if (!finance) {
    res.status(401).send("Invalid email or password");
    return;
  }
  const isMatch = await comparePassword(password, finance.password);
  if (isMatch) {
    const accessToken = generateAccessToken({
      email: finance.email,
      role: "finance",
    });
    const refreshToken = generateRefreshToken({
      email: finance.email,
      role: "finance",
    });
    setRefreshTokenCookie(res, refreshToken);
    setAccessTokenCookie(res, accessToken);
    res.status(StatusCodes.OK).send({ message: "Login successful" });
  } else {
    res.status(401).send("Invalid email or password");
  }
});
const disableFinance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Finance.findOneAndUpdate(
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
  getAllFinance,
  createFinance,
  getFinance,
  updateFinance,
  deleteFinance,
  authUser,
  disableFinance,
  logout,
};
