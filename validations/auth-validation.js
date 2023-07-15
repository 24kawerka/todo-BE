import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Email is required').notEmpty(),
  body('password', 'Password is required').notEmpty(),
  body('fullName', 'Full name is required').notEmpty(),
  body('email', 'Wrong email format').isEmail(),
  body('password', 'Password less than 5 symbols').isLength({ min: 5 }),
  body('fullName', 'Full name less than 5 symbols').isLength({ min: 5 }),
  body('avatarUrl', 'Wrong url format').optional().isURL(),
];

export const loginValidation = [
  body('email', 'Email is required').notEmpty(),
  body('email', 'Wrong email format').isEmail(),
  body('password', 'Password is required').notEmpty(),
];
