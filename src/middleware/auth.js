import { User } from '../models/User.js';
import { verifyAccessToken, verifyRefreshToken, signAccessToken, setAuthCookies } from '../utils/tokens.js';

export const requireAuth = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      const decoded = verifyAccessToken(accessToken);
      const user = await User.findById(decoded.userId).select('-passwordHash -refreshToken');
      if (!user) return res.status(401).json({ message: 'Unauthorized' });
      req.user = user;
      return next();
    }

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });

    const decodedRefresh = verifyRefreshToken(refreshToken);
    const user = await User.findById(decodedRefresh.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const newAccessToken = signAccessToken({ userId: user._id, role: user.role });
    setAuthCookies(res, newAccessToken, refreshToken);

    req.user = {
      _id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const optionalAuth = async (req, _res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) return next();
    const decoded = verifyAccessToken(accessToken);
    const user = await User.findById(decoded.userId).select('-passwordHash -refreshToken');
    if (user) req.user = user;
    next();
  } catch {
    next();
  }
};
