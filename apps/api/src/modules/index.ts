import { Application } from 'express';
import { TeacherRouter } from './teacher/teacher.router';
import { StudentRouter } from './student/student.router';
import { UserRouter } from './user/user.router';
import { OrganisationRouter } from './organisation/organisation.router';

export default function initializeModules(app: Application): void {
  app.use('/api/users', UserRouter);
  app.use('/api/organisation', OrganisationRouter);
  app.use('/api/students', StudentRouter);
  app.use('/api/teachers', TeacherRouter)
}
