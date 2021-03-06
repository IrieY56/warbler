/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const db = require('../models');

exports.createMessage = async (req, res, next) => {
  try {
    const message = await db.Message.create({
      text: req.body.text,
      user: req.params.id,
    });

    const foundUser = await db.User.findById(req.params.id);
    foundUser.messages.push(message.id);
    await foundUser.save();
    const foundMessage = await db.Message.findById(message.id).populate('user', {
      username: true,
      profileImageUrl: true,
    });
    return res.status(200).json(foundMessage);
  } catch (e) {
    return next(e);
  }
};

exports.getMessage = async (req, res, next) => {
  try {
    const message = await db.Message.find(req.params.message._id);
    return res.status(200).json(message);
  } catch (e) {
    return next(e);
  }
};
exports.deleteMessage = async (req, res, next) => {
  try {
    const foundMessage = await db.Message.findById(req.params.message_id);
    await foundMessage.remove();
    return res.status(200).json(foundMessage);
  } catch (e) {
    return next(e);
  }
};
