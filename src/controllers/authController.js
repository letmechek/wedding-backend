import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { isValidEmail } from '../utils/validators.js';
import {
  clearAuthCookies,
  setAuthCookies,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from '../utils/tokens.js';

const toSafeUser = (user) => ({
  _id: user._id,
  role: user.role,
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt
});

export const register = async (req, res) => {
  const { name, email, password, role = 'client' } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email: email.toLowerCase(), passwordHash, role });

  const accessToken = signAccessToken({ userId: user._id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id, role: user.role });
  user.refreshToken = refreshToken;
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);
  res.status(201).json({ user: toSafeUser(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = signAccessToken({ userId: user._id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id, role: user.role });

  user.refreshToken = refreshToken;
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);
  res.json({ user: toSafeUser(user) });
};

export const logout = async (req, res) => {
  if (req.user?._id) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
  }
  clearAuthCookies(res);
  res.json({ ok: true });
};

export const me = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  res.json({ user: req.user });
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const accessToken = signAccessToken({ userId: user._id, role: user.role });
    setAuthCookies(res, accessToken, refreshToken);

    res.json({ user: toSafeUser(user) });
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
