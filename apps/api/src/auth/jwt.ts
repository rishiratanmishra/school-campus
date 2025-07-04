import { config } from '@src/config/config';
import jwt, { SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  _id: string;
  role: string;
}

/**
 * Sign access token
 */
export function signJwt(payload: JwtPayload): string {
  const secret = config.jwtSecret;
  if (!secret) {
    throw new Error('JWT secret is not configured');
  }
  
  const expiresIn = config.jwtExpire;
  if (!expiresIn) {
    throw new Error('JWT expiration time is not configured');
  }
  
  return jwt.sign(
    payload as object,
    secret as string,
    { expiresIn: expiresIn as string } as SignOptions
  );
}

/**
 * Sign refresh token
 */
export function signRefreshToken(payload: JwtPayload): string {
  const secret = config.refreshTokenSecret;
  if (!secret) {
    throw new Error('Refresh token secret is not configured');
  }
  
  const expiresIn = config.refreshTokenExpire;
  if (!expiresIn) {
    throw new Error('Refresh token expiration time is not configured');
  }
  
  return jwt.sign(
    payload as object,
    secret as string,
    { expiresIn: expiresIn as string } as SignOptions
  );
}

/**
 * Verify access token
 */
export function verifyJwt(token: string): JwtPayload | null {
  try {
    const secret = config.jwtSecret;
    if (!secret) {
      throw new Error('JWT secret is not configured');
    }
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    const secret = config.refreshTokenSecret;
    if (!secret) {
      throw new Error('Refresh token secret is not configured');
    }
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    return null;
  }
}