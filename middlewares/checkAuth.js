import jwt from 'jsonwebtoken';
import { config } from '../utils/config.js';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  if (token) {
    try {
      const decoded = jwt.verify(token, config.key);
      req.userId = decoded._id;
      next();
    } catch (e) {
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
