import jwt from 'jsonwebtoken';
import { config } from '../utils/config.js';
import TodoModel from '../models/TodoModel.js';

export default async (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  if (token) {
    try {
      const decoded = jwt.verify(token, config.key);
      const todoItem = await TodoModel.findById(req.params.id);
      if (!todoItem) {
        return res.status(404).json({
          success: 'false',
          message: 'Todo was not found',
        });
      }
      const userId = todoItem?._doc?.user?._id;
      if (decoded._id !== userId.valueOf()) {
        return res.status(400).json({
          success: 'false',
          message: 'You have not access to working with this todo',
        });
      }
      req.userId = decoded._id;
      next();
    } catch (e) {
      console.log(e);
      res.status(403).json({
        success: false,
        message: 'Token expaired',
      });
    }
  } else {
    res.status(403).json({
      success: false,
      message: 'Token expaired',
    });
  }
};
