const asyncHandler = require('express-async-handler');
const Auth = require('../models/Auth.js');
const { generateToken } = require('../helpers/generateToken.js');

const user = {
  loginUser: asyncHandler(async (req, res) => {
    const { password, email } = req.body;
    const user = await Auth.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error(`Email does not exist`);
    }
    const userPassword = await Auth.findOne({ email });
    if (user && (await userPassword.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          email: user.email,
          token: generateToken(user.id),
        },
      });
    } else {
      res.status(401);
      throw new Error(`Invalid email or password`);
    }
  }),

  registerUser: asyncHandler(async (req, res) => {
    const { password, email } = req.body;
    const user = await Auth.findOne({ email });

    if (user) {
      res.status(401);
      throw new Error(`User already exists`);
    }
    await Auth.create({ email, password });
    res.json({
      success: true,
      message: 'User created successfully',
      data: { email },
    });
  }),
};

module.exports = user;
