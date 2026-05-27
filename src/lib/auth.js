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

// Must be defined before authenticateAdmin which calls it
export function isAdminEmail(email) {
  if (!email) return false;
  const ALLOWED_ADMIN_EMAILS = ['fasihmunir12@gmail.com', 'info@munidrip.com'];
  return ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function authenticateAdmin(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authentication required', status: 401 };
  }

  const token = authHeader.replace('Bearer ', '');
  const { valid, decoded, error } = verifyToken(token);
  if (!valid) {
    return { error: 'Invalid or expired token', status: 401 };
  }

  const { default: connectDB } = await import('@/lib/mongodb');
  const { default: User } = await import('@/models/User');
  await connectDB();

  const user = await User.findById(decoded.userId);
  if (!user) {
    return { error: 'User not found', status: 404 };
  }

  if (!user.isActive) {
    return { error: 'Account is disabled', status: 401 };
  }

  if (user.role !== 'admin' || !isAdminEmail(user.email)) {
    return { error: 'Admin access required', status: 403 };
  }

  return { user };
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
  isAdminEmail,
};