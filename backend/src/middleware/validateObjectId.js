import mongoose from 'mongoose';

import { AppError } from '../utils/AppError.js';

export const validateObjectId = (paramName = 'id') => (req, _res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    next(new AppError('Invalid resource id', 400));
    return;
  }

  next();
};
