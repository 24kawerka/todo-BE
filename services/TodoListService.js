import { validationResult } from 'express-validator';
import TodoModel from '../models/TodoModel.js';

export const createTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    const doc = new TodoModel({
      title: req.body.title,
      description: req.body.description,
      isPublic: req.body.isPublic || true,
      isDone: false,
      user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Failed to create a post',
    });
  }
};

export const getAllTodo = async (req, res) => {
  try {
    const posts = await TodoModel.find().populate('user').exec();
    res.json(posts);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Failed to get todos',
    });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedTodo = await TodoModel.findOneAndUpdate({
      _id: postId,
    });
    if (!updatedTodo) {
      return res.status(404).json({
        message: 'Todo was not found',
      });
    }
    res.json(updatedTodo);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Failed to get posts',
    });
  }
};

export const removeTodoById = async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedTodo = await TodoModel.findOneAndDelete({
      _id: postId,
    });
    if (!updatedTodo) {
      return res.status(404).json({
        message: 'Todo was not found',
      });
    }
    res.json({
      success: true,
      message: 'Todo was deleted',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Failed to get posts',
    });
  }
};

export const updateTodoById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    const postId = req.params.id;
    await TodoModel.findByIdAndUpdate(
      postId,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          isPublic: req.body.isPublic,
          isDone: req.body.isDone,
          user: req.userId,
        },
      },
    );
    res.json({
      success: true,
      message: 'Todo was updated',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Failed to update todo',
    });
  }
};
