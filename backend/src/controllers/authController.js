import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { generateToken } from '../utils/generateToken.js';
import { validateLoginInput, validateRegisterInput } from '../utils/validators.js';

const buildAuthResponse = (user) => ({
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  },
  token: generateToken(user._id)
});

export const register = asyncHandler(async (req, res) => {
  const { value, errors } = validateRegisterInput(req.body);

  if (errors.length > 0) {
    throw new AppError(errors.join('. '), 400);
  }

  const existingUser = await User.findOne({ email: value.email });

  if (existingUser) {
    throw new AppError('An account with this email already exists', 409);
  }

  const user = await User.create(value);

  res.status(201).json({
    status: 'success',
    data: buildAuthResponse(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { value, errors } = validateLoginInput(req.body);

  if (errors.length > 0) {
    throw new AppError(errors.join('. '), 400);
  }

  const user = await User.findOne({ email: value.email }).select('+password');

  if (!user || !(await user.comparePassword(value.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  res.status(200).json({
    status: 'success',
    data: buildAuthResponse(user)
  });
});
