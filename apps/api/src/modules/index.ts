import { Application } from 'express';
import userRoutes from '../modules/user/user.router';
// import schoolRoutes from './organisation/routes/organisation.route';
export default function initializeModules(app: Application): void {
  app.use('/api/users', userRoutes);
  // app.use('/api/schools', schoolRoutes);
}
