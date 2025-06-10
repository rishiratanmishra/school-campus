import { Application } from 'express';
import userRoutes from '../modules/user/user.router';
import organisationRoutes from '../modules/organisation/organisation.router';
import studentRoutes from '../modules/student/student.router';

export default function initializeModules(app: Application): void {
  app.use('/api/users', userRoutes);
  app.use('/api/organisation', organisationRoutes);
  app.use('/api/students', studentRoutes);
}
