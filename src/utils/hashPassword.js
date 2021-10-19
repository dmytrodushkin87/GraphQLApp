import bcrypt from 'bcryptjs';

const hashPassword = (password) => {
  if (password.length < 5) {
    throw new Error('password less than 5 characters')
  }
  return bcrypt.hash(password, 8);
}

export {hashPassword as default};
