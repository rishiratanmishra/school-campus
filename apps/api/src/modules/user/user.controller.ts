import { Request, Response } from 'express';
import { BaseController } from '@api-base/BaseController';
import { IUser, UserRole } from './user.model';
import { UserService } from './user.service';
import { ApiResponse } from '@api-base/response';
import { ServiceOptions } from '@api-base/BaseService';

export class UserController extends BaseController<IUser> {
  private userService: UserService;

  constructor() {
    const userService = new UserService();
    super(userService);
    this.userService = userService;
  }

  /**
   * Create new user
   */
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, role } = req.body;

      // Validation
      if (!name || !email || !password) {
        ApiResponse.error(res, 'Name, email, and password are required', 400);
        return;
      }

      // Check if email already exists
      const emailExists = await this.userService.emailExists(email);
      if (emailExists) {
        ApiResponse.error(res, 'Email already exists', 400);
        return;
      }

      // Create user
      const userData = { name, email, password, role: role || UserRole.USER };
      const user = await this.userService.createUser(userData);

      ApiResponse.success(res, 'User created successfully', user, 201);
    } catch (error: any) {
      console.error('Create user error:', error);
      ApiResponse.error(res, 'Failed to create user', 500, error.message);
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
        filters: result.filters
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
      const { _id } = req.body ;
      console.log('Get user by ID:', req.body);
      if (!_id || typeof _id !== 'string') {
        ApiResponse.error(res, 'User ID is required', 400);
        return;
      }
      const user = await this.userService.findById(_id, ['password']);
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
        filters: result.filters
      });
    } catch (error: any) {
      console.error('Get active users error:', error);
      ApiResponse.error(res, 'Failed to retrieve active users', 500, error.message);
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
        filters: result.filters
      });
    } catch (error: any) {
      console.error('Get admin users error:', error);
      ApiResponse.error(res, 'Failed to retrieve admin users', 500, error.message);
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
      const result = await this.userService.getUsersByRole(role as UserRole, options);

      ApiResponse.success(res, `${role} users retrieved successfully`, {
        users: result.data,
        pagination: result.pagination,
        filters: result.filters
      });
    } catch (error: any) {
      console.error('Get users by role error:', error);
      ApiResponse.error(res, 'Failed to retrieve users by role', 500, error.message);
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
      const result = await this.userService.searchUsers(searchTerm as string, options);

      ApiResponse.success(res, 'User search completed successfully', {
        users: result.data,
        pagination: result.pagination,
        filters: result.filters
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
      ApiResponse.error(res, 'Failed to toggle user status', 500, error.message);
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
        ApiResponse.error(res, 'New password must be at least 6 characters long', 400);
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
      ApiResponse.error(res, 'Failed to retrieve user statistics', 500, error.message);
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
        modifiedCount: result.modifiedCount
      });
    } catch (error: any) {
      console.error('Bulk deactivate users error:', error);
      ApiResponse.error(res, 'Failed to deactivate users', 500, error.message);
    }
  };

  /**
   * Verify user login
   */
  verifyLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        ApiResponse.error(res, 'Email and password are required', 400);
        return;
      }

      const result = await this.userService.verifyPassword(email, password);
      
      if (!result.isValid) {
        ApiResponse.error(res, 'Invalid email or password', 401);
        return;
      }

      ApiResponse.success(res, 'Login successful', result.user);
    } catch (error: any) {
      console.error('Verify login error:', error);
      ApiResponse.error(res, 'Login failed', 500, error.message);
    }
  };

  /**
   * Check email availability
   */
  checkEmailAvailability = async (req: Request, res: Response): Promise<void> => {
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
        available: !exists
      });
    } catch (error: any) {
      console.error('Check email availability error:', error);
      ApiResponse.error(res, 'Failed to check email availability', 500, error.message);
    }
  };
}