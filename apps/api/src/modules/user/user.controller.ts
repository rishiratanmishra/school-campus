import { Request, Response } from 'express';
import { BaseController } from '@api-base/base-classes/BaseController';
import { IUser, UserModel, UserRole } from './user.model';
import { UserService } from './user.service';
import { ApiResponse } from '@api-base/base-classes/response';
import { ServiceOptions } from '@api-base/base-classes/BaseService';
import bcrypt from 'bcrypt';
import { DocumentType } from '@typegoose/typegoose';
import { signJwt } from '@src/auth/jwt';
import crypto from 'crypto';

export class UserController extends BaseController<IUser> {
  private userService: UserService;

  constructor() {
    const userService = new UserService();
    super(userService);
    this.userService = userService;
  }

  /**
   * Generate refresh token and its hash
   */
  private generateRefreshToken(): {
    refreshToken: string;
    refreshTokenHash: string;
  } {
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    return { refreshToken, refreshTokenHash };
  }

  /**
   * Create new user
   */
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        res
          .status(409)
          .json({ success: false, message: 'User already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const { refreshToken, refreshTokenHash } = this.generateRefreshToken();

      const user = await UserModel.create({
        email,
        password: hashedPassword,
        name,
        refreshTokenHash,
      });

      const userDoc = user as DocumentType<IUser>;
      const accessToken = signJwt({
        _id: userDoc._id.toString(),
        role: userDoc.role,
      });

      const {
        password: _,
        refreshTokenHash: __,
        ...userWithoutPassword
      } = userDoc.toObject();

      res
        .cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000, // 15 minutes
        })
        .status(201)
        .json({
          success: true,
          message: 'User created successfully',
          data: userWithoutPassword,
          tokens: {
            refreshToken,
          },
        });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create user',
      });
    }
  };

  /**
   * Verify login
   */
  verifyLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        res
          .status(401)
          .json({ success: false, message: 'Invalid credentials' });
        return;
      }

      const userDoc = user as DocumentType<IUser>;
      const isMatch = await bcrypt.compare(password, userDoc.password);
      if (!isMatch) {
        res
          .status(401)
          .json({ success: false, message: 'Invalid credentials' });
        return;
      }

      const { refreshToken, refreshTokenHash } = this.generateRefreshToken();
      await UserModel.findByIdAndUpdate(userDoc._id, { refreshTokenHash });
      const accessToken = signJwt({
        _id: userDoc._id.toString(),
        role: userDoc.role,
      });

      const {
        password: _,
        refreshTokenHash: __,
        ...userWithoutPassword
      } = userDoc.toObject();

      res
        .cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
        })
        .status(200)
        .json({
          success: true,
          message: 'Login successful',
          data: userWithoutPassword,
          tokens: {
            refreshToken,
          },
        });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, message: error.message || 'Login failed' });
    }
  };

  /**
   * Refresh access token using refresh token
   */
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res
          .status(401)
          .json({ success: false, message: 'Refresh token required' });
        return;
      }

      const hashedRefreshToken = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');
      const user = await UserModel.findOne({
        refreshTokenHash: hashedRefreshToken,
      });
      if (!user) {
        res
          .status(401)
          .json({ success: false, message: 'Invalid refresh token' });
        return;
      }

      const {
        refreshToken: newRefreshToken,
        refreshTokenHash: newRefreshTokenHash,
      } = this.generateRefreshToken();
      const newAccessToken = signJwt({
        _id: user._id.toString(),
        role: user.role,
      });
      await UserModel.findByIdAndUpdate(user._id, {
        refreshTokenHash: newRefreshTokenHash,
      });

      res
        .cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
        })
        .status(200)
        .json({
          success: true,
          message: 'Token refreshed successfully',
          tokens: {
            refreshToken: newRefreshToken,
          },
        });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Token refresh failed',
      });
    }
  };

  /**
   * Logout user (invalidate refresh token)
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res
          .status(400)
          .json({ success: false, message: 'Refresh token required' });
        return;
      }

      const hashedRefreshToken = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

      const user = await UserModel.findOneAndUpdate(
        { refreshTokenHash: hashedRefreshToken },
        { $unset: { refreshTokenHash: 1 } },
        { new: true }
      );

      if (!user) {
        res
          .status(401)
          .json({ success: false, message: 'Invalid refresh token' });
        return;
      }

      res
        .clearCookie('accessToken')
        .status(200)
        .json({ success: true, message: 'Logged out successfully' });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, message: error.message || 'Logout failed' });
    }
  };

  /**
   * Get all users with advanced filtering
   */
  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const options: ServiceOptions = this.buildServiceOptions(req);
      const result = await this.userService.getAllUsers(options);

      ApiResponse.success(res, 'Users retrieved successfully', {
        users: result.data,
        pagination: result.pagination,
        filters: result.filters,
      });
    } catch (error: any) {
      console.error('Get all users error:', error);
      ApiResponse.error(res, 'Failed to retrieve users', 500, error.message);
    }
  };

  /**
   * Get user by ID
   */
  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { _id } = req.body;
      console.log('Get user by ID:', req.body);
      if (!_id || typeof _id !== 'string') {
        ApiResponse.error(res, 'User ID is required', 400);
        return;
      }
      const user = await this.userService.findById(_id, [
        'password',
        'refreshTokenHash',
      ]);
      if (!user) {
        ApiResponse.error(res, 'User not found', 404);
        return;
      }

      ApiResponse.success(res, 'User retrieved successfully', user);
    } catch (error: any) {
      console.error('Get user by ID error:', error);
      ApiResponse.error(res, 'Failed to retrieve user', 500, error.message);
    }
  };

  /**
   * Update user
   */
  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { _id } = req.params;
      const { name, email, role, isActive } = req.body;

      if (!_id || typeof _id !== 'string') {
        ApiResponse.error(res, 'User _id is required', 400);
        return;
      }

      // Check if email exists for other users
      if (email) {
        const emailExists = await this.userService.emailExists(email, _id);
        if (emailExists) {
          ApiResponse.error(res, 'Email already exists', 400);
          return;
        }
      }

      const updateData: Partial<IUser> = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;
      if (typeof isActive === 'boolean') updateData.isActive = isActive;

      const user = await this.userService.updateById(_id, updateData);
      if (!user) {
        ApiResponse.error(res, 'User not found', 404);
        return;
      }

      ApiResponse.success(res, 'User updated successfully', user);
    } catch (error: any) {
      console.error('Update user error:', error);
      ApiResponse.error(res, 'Failed to update user', 500, error.message);
    }
  };

  /**
   * Delete user
   */
  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { _id } = req.params;

      if (!_id || typeof _id !== 'string') {
        ApiResponse.error(res, 'User ID is required', 400);
        return;
      }

      const user = await this.userService.deleteById(_id);
      if (!user) {
        ApiResponse.error(res, 'User not found', 404);
        return;
      }

      ApiResponse.success(res, 'User deleted successfully', user);
    } catch (error: any) {
      console.error('Delete user error:', error);
      ApiResponse.error(res, 'Failed to delete user', 500, error.message);
    }
  };

  /**
   * Get active users
   */
  getActiveUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const options: ServiceOptions = this.buildServiceOptions(req);
      const result = await this.userService.getActiveUsers(options);

      ApiResponse.success(res, 'Active users retrieved successfully', {
        users: result.data,
        pagination: result.pagination,
        filters: result.filters,
      });
    } catch (error: any) {
      console.error('Get active users error:', error);
      ApiResponse.error(
        res,
        'Failed to retrieve active users',
        500,
        error.message
      );
    }
  };

  /**
   * Get admin users
   */
  getAdminUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const options: ServiceOptions = this.buildServiceOptions(req);
      const result = await this.userService.getAdminUsers(options);

      ApiResponse.success(res, 'Admin users retrieved successfully', {
        users: result.data,
        pagination: result.pagination,
        filters: result.filters,
      });
    } catch (error: any) {
      console.error('Get admin users error:', error);
      ApiResponse.error(
        res,
        'Failed to retrieve admin users',
        500,
        error.message
      );
    }
  };

  /**
   * Get users by role
   */
  getUsersByRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { role } = req.params;

      if (!Object.values(UserRole).includes(role as UserRole)) {
        ApiResponse.error(res, 'Invalid role', 400);
        return;
      }

      const options: ServiceOptions = this.buildServiceOptions(req);
      const result = await this.userService.getUsersByRole(
        role as UserRole,
        options
      );

      ApiResponse.success(res, `${role} users retrieved successfully`, {
        users: result.data,
        pagination: result.pagination,
        filters: result.filters,
      });
    } catch (error: any) {
      console.error('Get users by role error:', error);
      ApiResponse.error(
        res,
        'Failed to retrieve users by role',
        500,
        error.message
      );
    }
  };

  /**
   * Search users
   */
  searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { searchTerm } = req.query;

      if (!searchTerm) {
        ApiResponse.error(res, 'Search term is required', 400);
        return;
      }

      const options: ServiceOptions = this.buildServiceOptions(req);
      const result = await this.userService.searchUsers(
        searchTerm as string,
        options
      );

      ApiResponse.success(res, 'User search completed successfully', {
        users: result.data,
        pagination: result.pagination,
        filters: result.filters,
      });
    } catch (error: any) {
      console.error('Search users error:', error);
      ApiResponse.error(res, 'Failed to search users', 500, error.message);
    }
  };

  /**
   * Toggle user status
   */
  toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { _id } = req.params;

      if (!_id || typeof _id !== 'string') {
        ApiResponse.error(res, 'User ID is required', 400);
        return;
      }

      const user = await this.userService.toggleUserStatus(_id);
      if (!user) {
        ApiResponse.error(res, 'User not found', 404);
        return;
      }

      ApiResponse.success(res, 'User status updated successfully', user);
    } catch (error: any) {
      console.error('Toggle user status error:', error);
      ApiResponse.error(
        res,
        'Failed to toggle user status',
        500,
        error.message
      );
    }
  };

  /**
   * Change user role
   */
  changeUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { _id } = req.params;
      const { role } = req.body;

      if (!_id || typeof _id !== 'string') {
        ApiResponse.error(res, 'User _id is required', 400);
        return;
      }

      if (!role || !Object.values(UserRole).includes(role)) {
        ApiResponse.error(res, 'Valid role is required', 400);
        return;
      }

      const user = await this.userService.changeUserRole(_id, role);
      if (!user) {
        ApiResponse.error(res, 'User not found', 404);
        return;
      }

      ApiResponse.success(res, 'User role updated successfully', user);
    } catch (error: any) {
      console.error('Change user role error:', error);
      ApiResponse.error(res, 'Failed to change user role', 500, error.message);
    }
  };

  /**
   * Update user password
   */
  updatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { _id } = req.body || req.params;
      const { newPassword } = req.body;

      if (!_id || typeof _id !== 'string') {
        ApiResponse.error(res, 'User ID is required', 400);
        return;
      }

      if (!newPassword || newPassword.length < 6) {
        ApiResponse.error(
          res,
          'New password must be at least 6 characters long',
          400
        );
        return;
      }

      const user = await this.userService.updatePassword(_id, newPassword);
      if (!user) {
        ApiResponse.error(res, 'User not found', 404);
        return;
      }

      ApiResponse.success(res, 'Password updated successfully');
    } catch (error: any) {
      console.error('Update password error:', error);
      ApiResponse.error(res, 'Failed to update password', 500, error.message);
    }
  };

  /**
   * Get user statistics
   */
  getUserStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.userService.getUserStats();
      ApiResponse.success(res, 'User statistics retrieved successfully', stats);
    } catch (error: any) {
      console.error('Get user stats error:', error);
      ApiResponse.error(
        res,
        'Failed to retrieve user statistics',
        500,
        error.message
      );
    }
  };

  /**
   * Bulk deactivate users
   */
  bulkDeactivateUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userIds } = req.body;

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        ApiResponse.error(res, 'User IDs array is required', 400);
        return;
      }

      const result = await this.userService.bulkDeactivateUsers(userIds);

      ApiResponse.success(res, 'Bulk deactivation completed', {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      });
    } catch (error: any) {
      console.error('Bulk deactivate users error:', error);
      ApiResponse.error(res, 'Failed to deactivate users', 500, error.message);
    }
  };

  /**
   * Check email availability
   */
  checkEmailAvailability = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { email } = req.query;
      const { excludeUserId } = req.query;

      if (!email) {
        ApiResponse.error(res, 'Email is required', 400);
        return;
      }

      const exists = await this.userService.emailExists(
        email as string,
        excludeUserId as string
      );

      ApiResponse.success(res, 'Email availability checked', {
        email,
        available: !exists,
      });
    } catch (error: any) {
      console.error('Check email availability error:', error);
      ApiResponse.error(
        res,
        'Failed to check email availability',
        500,
        error.message
      );
    }
  };

  /**
   * Invalidate all refresh tokens for a user (useful for security)
   */
  invalidateAllTokens = async (req: Request, res: Response): Promise<void> => {
    try {
      const { _id } = req.params;

      if (!_id || typeof _id !== 'string') {
        ApiResponse.error(res, 'User ID is required', 400);
        return;
      }

      const user = await UserModel.findByIdAndUpdate(
        _id,
        { $unset: { refreshTokenHash: 1 } },
        { new: true }
      );

      if (!user) {
        ApiResponse.error(res, 'User not found', 404);
        return;
      }

      ApiResponse.success(res, 'All tokens invalidated successfully');
    } catch (error: any) {
      console.error('Invalidate all tokens error:', error);
      ApiResponse.error(res, 'Failed to invalidate tokens', 500, error.message);
    }
  };

  /**
   * Get current user profile (using JWT token)
   */
  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?._id;

      if (!userId) {
        ApiResponse.error(res, 'User not authenticated', 401);
        return;
      }

      const user = await this.userService.findById(userId, [
        'password',
        'refreshTokenHash',
      ]);
      if (!user) {
        ApiResponse.error(res, 'User not found', 404);
        return;
      }

      ApiResponse.success(res, 'Current user retrieved successfully', user);
    } catch (error: any) {
      console.error('Get current user error:', error);
      ApiResponse.error(
        res,
        'Failed to retrieve current user',
        500,
        error.message
      );
    }
  };
}
