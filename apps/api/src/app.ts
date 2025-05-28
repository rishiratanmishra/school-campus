import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import initializeModules from './modules';
const app = express();
import dotenv from 'dotenv';
dotenv.config();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
initializeModules(app);
// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
});

export default app;
