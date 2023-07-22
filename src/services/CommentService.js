import { validationResult } from 'express-validator';
import TodoModel from '../models/TodoModel.js';
import CommentModel from '../models/CommentModel.js';
import UserModel from '../models/UserModel.js';

export const createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    const user = await UserModel.findById(req.userId);
    const todo = await TodoModel.findById(req.body.id);
    if (!todo) {
      return res.status(400).json({
        success: false,
        message: 'Todo was not found',
      });
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User was not found',
      });
    }
    const doc = new CommentModel({
      text: req.body.text,
      user: {
        _id: user._id,
        fullName: user.fullName,
      },
      todo: req.body.id,
    });
    const comment = await doc.save();
    res.json(comment);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Failed to create a comment',
    });
  }
};

export const getAllTodoComments = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(404).json({
        success: false,
        message: 'Todo was not found',
      });
    }
    const comments = await CommentModel.find({ todo: req.params.id });
    return res.json(comments);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Failed to get a comments',
    });
  }
};
