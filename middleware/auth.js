const jwt = require("jsonwebtoken");
const { setAccessTokenCookie, generateAccessToken } = require("../utils/token");
const { SuperAdminToken, AdminToken } = require("../model");

const authMiddleware = async (req, res, next) => {
  const accessToken = req.headers.authorization || req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({
      message:
        "Access token missing please login again/or generate access token again",
    });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    req.decoded = decoded;
    //superAdmin !=superAdmin(false)&& undefiend != schoolAdmin(on superadmin login always true)
    if (decoded.role != "superAdmin" && decoded.role != "schoolAdmin") {
      return res.status(401).json({ message: "Unauthorized 1" });
    }
    //check for vaild token here
    if (decoded.role === "superAdmin") {
      const superAdminToken = await SuperAdminToken.findOne({ accessToken });
      if (superAdminToken.length < 1) {
        console.log("access token of SuperAdmin is not present in Db");
        throw new Error("access token of SuperAdmin is not present in Db");
      }
    } else {
      const adminToken = await AdminToken.findOne({ accessToken });
      if (adminToken.length < 1) {
        console.log("access token of Admin is not present in Db");
        throw new Error("access token of Admin is not present in Db");
      }
    }
    req.needAccessToken = false;
    next();
  } catch (error) {
    req.needAccessToken = true;
    next();
  }
};
const AccessTokenGenerate = async (req, res, next) => {
  if (req.needAccessToken) {
    const refreshToken = req.headers.authorization || req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message:
          "Access token missing please login again/or generate access token again",
      });
    }
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
      if (decoded.role !== "superAdmin" && decoded.role !== "schoolAdmin") {
        return res.status(401).json({ message: "isSuperAdmin Unauthorized" });
      }
      // console.log(decoded);
      if (decoded.role === "superAdmin") {
        const superAdminToken = await SuperAdminToken.findOne({ refreshToken });
        // console.log("Check point ");
        if (superAdminToken.length < 1) {
          console.log("superAdminToken not found in db");
          throw new Error("access token of SuperAdmin is not present in Db");
        }
        const accessToken = generateAccessToken({
          email: decoded.email,
          role: "superAdmin",
          Id: decoded._id,
        });
        // console.log("Check point 2");
        const updatedToken = await SuperAdminToken.findOneAndUpdate(
          { refreshToken },
          { accessToken: accessToken }
        );
        // console.log("Check point 3");

        setAccessTokenCookie(res, accessToken);
      } else {
        // console.log(refreshToken);
        const adminToken = await AdminToken.findOne({
          refreshToken: refreshToken,
        });
        if (adminToken.length < 1) {
          console.log("adminToken not found in db");
          throw new Error("access token of Admin is not present in Db");
        }
        const accessToken = generateAccessToken({
          email: decoded.email,
          role: "schoolAdmin",
          Id: decoded._id,
        });
        const updatedToken = await AdminToken.findOneAndUpdate(
          { refreshToken },
          { accessToken: accessToken }
        );
        setAccessTokenCookie(res, accessToken);
      }
      req.decoded = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "AccessTokenGenerate middleware error",
      });
    }
  } else {
    next();
  }
};
module.exports = { authMiddleware, AccessTokenGenerate };
// var a = moment([2007, 0, 29]);
// var b = moment([2007, 0, 28]);
// a.diff(b, 'days') // 1
//   const token = jwt.sign({
//     email: user.email,
//     isSuperAdmin: true
//   }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

// {email: user.email,isSuperAdmin : true}
// console.log(moment.unix(decoded.exp));
// console.log(currDate);
// if (currDate > moment.unix(decoded.exp)) {
//     try {
//       const refreshDecoded = jwt.verify(
//         refreshToken,
//         process.env.REFRESH_TOKEN
//       );
//       if (!refreshDecoded.isSuperAdmin) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }
//       const accessToken = generateAccessToken({
//         email: refreshDecoded.email,
//         isSuperAdmin: true,
//       });
//       setAccessTokenCookie(res, accessToken);
//       next();
//     } catch (error) {
//       console.error(error.message);
//       return res.status(403).json({
//         message:
//           "Invalid refresh token please login again/or generate refresh token again",
//       });
//     }
//   }
// console.error(error.message);
// return res.status(403).json({
//   message:
//     "Invalid refresh token please login again/or generate refresh token again",
// });
//"Refresh token missing please login again/or generate access token again"
