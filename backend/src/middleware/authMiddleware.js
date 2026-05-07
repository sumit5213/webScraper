import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : null;

  if (!token) {
    throw new AppError('Authentication token is required', 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(token, config.jwtSecret);
  } catch (_error) {
    throw new AppError('Invalid or expired authentication token', 401);
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError('The user for this token no longer exists', 401);
  }

  req.user = user;
  next();
});
