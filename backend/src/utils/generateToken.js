import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';

export const generateToken = (userId) =>
  jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
