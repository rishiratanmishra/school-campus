import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://rishi211hitcseaiml2020:rishi211hitcseaiml2020@schoolcampus0.t3qrgc4.mongodb.net/schoolcampus?retryWrites=true&w=majority',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  jwtExpire: process.env.JWT_EXPIRE || '1d'
};