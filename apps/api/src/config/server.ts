import app from '../app';
import { config } from './config';
import { connectDB } from './database';

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(` Server running on port ${config.port}`);
      console.log(` Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
