import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@src/modules/user/user.model';

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: UserRole;
    [key: string]: any;
  };
}

export const authorizeRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized: No user in request' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
      return;
    }

    next();
  };
};
