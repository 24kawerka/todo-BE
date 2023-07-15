import { body } from 'express-validator';

export const todoItemValidation = [
  body('title', 'Title is required').notEmpty(),
  body('description').optional(),
  body('isPublic').optional(),
];
