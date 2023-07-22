import { body } from 'express-validator';

export const commentValidation = [
  body('text', 'Text is required').notEmpty(),
  body('id', 'Todo id is required').notEmpty(),
];