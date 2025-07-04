import { config } from '@src/config/config';
import { UserModel } from '@src/modules/user/user.model';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
    name?: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res
      .status(401)
      .json({ success: false, message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { _id: string };

    const user = await UserModel.findById(decoded._id).select('name role'); // don't fetch password

    if (!user) {
      res
        .status(401)
        .json({ success: false, message: 'Unauthorized: User not found' });
      return;
    }

    req.user = {
      _id: user._id.toString(),
      role: user.role || 'USER',
      name: user.name?.toString() || undefined,
    };

    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
