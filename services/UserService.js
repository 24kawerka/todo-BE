import UserModel from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { config } from '../utils/config.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array({ onlyFirstError: true }));
    }
    const { body } = req;
    const { email, fullName, password, avatarUrl } = body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const doc = new UserModel({
      email,
      fullName,
      passwordHash,
      avatarUrl,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      config.key,
      {
        expiresIn: '1d',
      },
    );

    const { _doc } = user;
    //TODO: {pass, ...userData} = user
    const {
      email: userEmail,
      fullName: userFullName,
      avatarUrl: userAvatarUrl,
      _id,
      createdAt,
    } = _doc;

    res.json({
      email: userEmail,
      avatarUrl: userAvatarUrl,
      fullName: userFullName,
      _id,
      createdAt,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Failed to register',
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array({ onlyFirstError: true }));
    }
    const user = await UserModel.findOne({ email: req.body.email });
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash,
    );
    if (!user || !isValidPass) {
      return res.status(400).json({
        success: false,
        message: 'Email or password is not correct',
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      config.key,
      {
        expiresIn: '1d',
      },
    );
    const { _doc } = user;
    //TODO: {pass, ...userData} = user
    const {
      email: userEmail,
      fullName: userFullName,
      avatarUrl: userAvatarUrl,
      _id,
      createdAt,
    } = _doc;

    res.json({
      email: userEmail,
      avatarUrl: userAvatarUrl,
      fullName: userFullName,
      _id,
      createdAt,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    const { _doc } = user;
    //TODO: {pass, ...userData} = user
    const {
      email: userEmail,
      fullName: userFullName,
      avatarUrl: userAvatarUrl,
      _id,
      createdAt,
    } = _doc;

    res.json({
      email: userEmail,
      avatarUrl: userAvatarUrl,
      fullName: userFullName,
      _id,
      createdAt,
    });
    return res.json({
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
    });
  }
};
