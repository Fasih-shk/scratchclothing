import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'replace_with_a_long_random_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export function generateToken(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    ...options,
  });
}

export function verifyToken(token) {
  try {
    return { valid: true, decoded: jwt.verify(token, JWT_SECRET) };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export function generateOTP(length = 6) {
  return crypto.randomInt(100000, 999999).toString();
}

export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function generateReferralCode() {
  return 'MD' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

export default {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  generateOTP,
  generateResetToken,
};