const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cleanString = (value) => (typeof value === 'string' ? value.trim() : '');

export const validateRegisterInput = (body = {}) => {
  const value = {
    name: cleanString(body.name),
    email: cleanString(body.email).toLowerCase(),
    password: typeof body.password === 'string' ? body.password : ''
  };
  const errors = [];

  if (value.name.length < 2 || value.name.length > 80) {
    errors.push('Name must be between 2 and 80 characters');
  }

  if (!emailRegex.test(value.email)) {
    errors.push('A valid email is required');
  }

  if (value.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  return { value, errors };
};

export const validateLoginInput = (body = {}) => {
  const value = {
    email: cleanString(body.email).toLowerCase(),
    password: typeof body.password === 'string' ? body.password : ''
  };
  const errors = [];

  if (!emailRegex.test(value.email)) {
    errors.push('A valid email is required');
  }

  if (!value.password) {
    errors.push('Password is required');
  }

  return { value, errors };
};
