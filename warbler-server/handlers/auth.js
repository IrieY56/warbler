const jwt = require('jsonwebtoken');
const db = require('../models');

exports.signup = async (req, res, next) => {
  try {
    const user = await db.User.create(req.body);
    const { id, username, profileImageUrl } = user;
    const token = jwt.sign(
      {
        id,
        username,
        profileImageUrl,
      },
      process.env.SECRET_KEY,
    );

    return res.status(200).json({
      id,
      username,
      profileImageUrl,
      token,
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = 'Sorry, that username and/or email is already is use.';
    }
    return next({
      status: 400,
      message: `Error Signing up: ${err.message}`,
    });
  }
};

exports.signin = async (req, res, next) => {
  try {
    const user = await db.User.findOne().or([
      { email: req.body.name },
      { username: req.body.name },
    ]);
    const { id, username, profileImageUrl } = user;
    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      const token = jwt.sign(
        {
          id,
          username,
          profileImageUrl,
        },
        process.env.SECRET_KEY,
      );
      res.status(200).json({
        id,
        username,
        profileImageUrl,
        token,
      });
    } else {
      return next({
        status: 400,
        message: 'Invalid Email/Password',
      });
    }
  } catch (e) {
    return next({
      status: 400,
      message: 'Invalid Email/Password',
    });
  }
};
