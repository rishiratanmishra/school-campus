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
    organisation?: {
      _id: string;
      name?: string;
    };
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

    // IMPORTANT: Populate the organisation field to get organisation data
    const user = await UserModel.findById(decoded._id)
      .select('name role organisation')
      .populate('organisation', 'name'); // Populate organisation with name field

    if (!user) {
      res
        .status(401)
        .json({ success: false, message: 'Unauthorized: User not found' });
      return;
    }

    console.log('Found user in middleware:', user);

    req.user = {
      _id: user._id.toString(),
      role: user.role || 'USER',
      name: user.name?.toString() || undefined,
      // Add organisation information if it exists
      organisation: user.organisation ? {
        _id: (user.organisation as any)._id.toString(),
        name: (user.organisation as any).name
      } : undefined
    };

    console.log('Set req.user in middleware:', req.user);

    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};