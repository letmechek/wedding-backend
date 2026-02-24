import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signAccessToken = (payload) =>
  jwt.sign(payload, env.accessTokenSecret, { expiresIn: env.accessTokenExpires });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, env.refreshTokenSecret, { expiresIn: env.refreshTokenExpires });

export const verifyAccessToken = (token) => jwt.verify(token, env.accessTokenSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, env.refreshTokenSecret);

const baseCookieOptions = {
  httpOnly: true,
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  secure: env.nodeEnv === 'production'
};

export const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    ...baseCookieOptions,
    maxAge: 1000 * 60 * 15
  });
  res.cookie('refreshToken', refreshToken, {
    ...baseCookieOptions,
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
};

export const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', baseCookieOptions);
  res.clearCookie('refreshToken', baseCookieOptions);
};
