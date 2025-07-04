import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: string | number;
  mongoUri: string;
  jwtSecret: string;
  jwtExpire: string;
  refreshTokenSecret: string;
  refreshTokenExpire: string;
  frontendUrl: string;
}

export const config: Config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://rishi211hitcseaiml2020:rishi211hitcseaiml2020@schoolcampus0.t3qrgc4.mongodb.net/schoolcampus?retryWrites=true&w=majority',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
  jwtExpire: process.env.JWT_EXPIRE || '1d',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret-key',
  refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};