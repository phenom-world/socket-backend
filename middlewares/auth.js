const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
dotenv.config();
const Auth = require('../models/Auh');
const jwt = require('jsonwebtoken');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  const authorization = req.headers.authorization || req.headers['x-access-token'];

  if (!authorization) {
    throw new Error('No token provided');
  }
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(401);
    throw new Error(`Invalid Token`);
  }

  req.user = await Auth.findById(decoded.id);
  if (!req.user) {
    throw new Error(`Not authorized to access this route`);
  }
  next();
});
