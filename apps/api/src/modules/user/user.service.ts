import bcrypt from 'bcryptjs';
import { FilterQuery } from 'mongoose';
import { IUser, UserModel, UserRole } from './user.model';
import { BaseService, ServiceOptions, ServiceResponse } from '@api-base/BaseService';
export class UserService extends BaseService<IUser> {
  constructor() {
    super(UserModel);
  }

  /**
   * Create new user with password hashing
   */
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      if (userData.password) {
        const saltRounds = 12;
        userData.password = await bcrypt.hash(userData.password, saltRounds);
      }

      const user = await this.create(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string, includePassword: boolean = false): Promise<IUser | null> {
    try {
      const hideKeys = includePassword ? [] : ['password'];
      const user = await this.findOne({ email }, hideKeys);
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify user password
   */
  async verifyPassword(email: string, password: string): Promise<{ isValid: boolean; user?: IUser }> {
    try {
      const user = await this.findByEmail(email, true);
      if (!user) {
        return { isValid: false };
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        // Return user without password
        const userWithoutPassword = await this.findByEmail(email, false);
        return { isValid: true, user: userWithoutPassword! };
      }

      return { isValid: false };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user password
   */
  async updatePassword(userId: string, newPassword: string): Promise<IUser | null> {
    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      const updatedUser = await this.updateById(userId, { password: hashedPassword });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all active users
   */
  async getActiveUsers(options: ServiceOptions = {}): Promise<ServiceResponse<IUser>> {
    try {
      const serviceOptions: ServiceOptions = {
        ...options,
        customFilters: { 
          ...options.customFilters, 
          isActive: true 
        },
        hideKeys: ['password', ...(options.hideKeys || [])]
      };

      return await this.findAll(serviceOptions);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all admin users
   */
  async getAdminUsers(options: ServiceOptions = {}): Promise<ServiceResponse<IUser>> {
    try {
      const serviceOptions: ServiceOptions = {
        ...options,
        customFilters: { 
          ...options.customFilters, 
          role: UserRole.ADMIN 
        },
        hideKeys: ['password', ...(options.hideKeys || [])]
      };

      return await this.findAll(serviceOptions);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole, options: ServiceOptions = {}): Promise<ServiceResponse<IUser>> {
    try {
      const serviceOptions: ServiceOptions = {
        ...options,
        customFilters: { 
          ...options.customFilters, 
          role 
        },
        hideKeys: ['password', ...(options.hideKeys || [])]
      };

      return await this.findAll(serviceOptions);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(userId: string): Promise<IUser | null> {
    try {
      const user = await this.findById(userId);
      if (!user) {
        return null;
      }

      const updatedUser = await this.updateById(userId, { 
        isActive: !user.isActive 
      });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search users by name or email
   */
  async searchUsers(searchTerm: string, options: ServiceOptions = {}): Promise<ServiceResponse<IUser>> {
    try {
      const serviceOptions: ServiceOptions = {
        ...options,
        searchTerm,
        searchKeys: ['name', 'email'],
        hideKeys: ['password', ...(options.hideKeys || [])]
      };

      return await this.findAll(serviceOptions);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change user role
   */
  async changeUserRole(userId: string, newRole: UserRole): Promise<IUser | null> {
    try {
      const updatedUser = await this.updateById(userId, { role: newRole });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    admins: number;
    users: number;
    recentlyCreated: number;
    recentlyUpdated: number;
  }> {
    try {
      const baseStats = await this.getStats();
      
      const [admins, users] = await Promise.all([
        this.count({ role: UserRole.ADMIN }),
        this.count({ role: UserRole.USER })
      ]);

      return {
        total: baseStats.total ?? 0,
        active: baseStats.active ?? 0,
        inactive: baseStats.inactive ?? 0,
        admins,
        users,
        recentlyCreated: baseStats.recentlyCreated ?? 0,
        recentlyUpdated: baseStats.recentlyUpdated ?? 0
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk deactivate users
   */
  async bulkDeactivateUsers(userIds: string[]): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      const filter = { _id: { $in: userIds } };
      const updateData = { isActive: false };
      
      return await this.updateMany(filter, updateData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string, excludeUserId?: string): Promise<boolean> {
    try {
      const filter: FilterQuery<IUser> = { email };
      
      if (excludeUserId) {
        filter._id = { $ne: excludeUserId };
      }

      return await this.exists(filter);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get users with pagination and without password
   */
  async getAllUsers(options: ServiceOptions = {}): Promise<ServiceResponse<IUser>> {
    try {
      const serviceOptions: ServiceOptions = {
        ...options,
        hideKeys: ['password', ...(options.hideKeys || [])]
      };

      return await this.findAll(serviceOptions);
    } catch (error) {
      throw error;
    }
  }
}