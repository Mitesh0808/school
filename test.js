// const mongoose = require('mongoose');

// const SuperAdminSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   }
// });

// module.exports = mongoose.model('SuperAdmin', SuperAdminSchema);

// //con
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const SuperAdmin = require('../models/SuperAdmin');

// const createSuperAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if the email already exists
//     const existingSuperAdmin = await SuperAdmin.findOne({ email });
//     if (existingSuperAdmin) {
//       return res.status(400).json({ message: 'Super Admin already exists' });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create the new Super Admin
//     const newSuperAdmin = new SuperAdmin({
//       email,
//       password: hashedPassword
//     });

//     // Save the Super Admin to the database
//     await newSuperAdmin.save();

//     // Generate access token
//     const accessToken = jwt.sign({ id: newSuperAdmin._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });

//     // Generate refresh token
//     const refreshToken = jwt.sign({ id: newSuperAdmin._id }, process.env.REFRESH_TOKEN_SECRET);

//     // Set cookies for tokens
//     res.cookie('accessToken', accessToken, { httpOnly: true });
//     res.cookie('refreshToken', refreshToken, { httpOnly: true });

//     res.status(201).json({ message: 'Super Admin created' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const loginSuperAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if the email exists
//     const superAdmin = await SuperAdmin.findOne({ email });
//     if (!superAdmin) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Check if the password is correct
//     const validPassword = await bcrypt.compare(password, superAdmin.password);
//     if (!validPassword) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Generate access token
//     const accessToken = jwt.sign({ id: superAdmin._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });

//     // Generate refresh token
//     const refreshToken = jwt.sign({ id: superAdmin._id }, process.env.REFRESH_TOKEN_SECRET);

//     // Set cookies for tokens
//     res.cookie('accessToken', accessToken, { httpOnly: true });
//     res.cookie('refreshToken', refreshToken, { httpOnly: true });

//     res.status(200).json({ message: 'Super Admin logged in' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const logoutSuperAdmin = (req, res) => {
//   res.clearCookie('accessToken');
//   res.clearCookie('refreshToken');
//   res.status(200).json({ message: 'Super Admin logged out' });
// };

// module.exports = { createSuperAdmin, loginSuperAdmin, logoutSuperAdmin };
// //

// const useragent = require('useragent');

// function getUserAgentInfo(userAgentString, orientation, ipAddress) {
//   const ua = useragent.parse(userAgentString);

//   const os = ua.os.toString();
//   const osVersion = ua.os.toVersion();
//   const browser = ua.family;
//   const browserVersion = ua.toVersion();
//   const device = ua.device.toString();
//   const deviceType = ua.device.family;
//   const isDesktop = ua.isDesktop;
//   const isMobile = ua.isMobile;
//   const isTablet = ua.isTablet;

//   const result = {
//     os,
//     osVersion,
//     browser,
//     browserVersion,
//     device,
//     deviceType,
//     orientation,
//     isDesktop,
//     isMobile,
//     isTablet,
//     ip: ipAddress
//   };

//   return result;
// }

// module.exports = getUserAgentInfo;

// const express = require('express');
// const app = express();
// const getUserAgentInfo = require('./getUserAgentInfo');

// app.post('/login', (req, res) => {
//   const userAgentString = req.headers['user-agent'];
//   const orientation = req.headers['orientation'];
//   const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//   const userInfo = getUserAgentInfo(userAgentString, orientation, ipAddress);

//   // Log user details
//   console.log(userInfo);

//   // Continue with login logic
// });
