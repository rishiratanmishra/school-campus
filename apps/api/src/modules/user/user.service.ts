// import { BaseService, ServiceOptions, ServiceResponse } from '../../../utils/BaseService';
import { FilterQuery } from 'mongoose';
import bcrypt from 'bcryptjs';
import { BaseService, ServiceOptions, ServiceResponse } from '@api-base/BaseService';
import { IUser, User } from './user.model';
export interface UserFilterOptions extends ServiceOptions {
  role?: 'USER' | 'ADMIN';
  isActive?: boolean;
  emailDomain?: string;
  createdDateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
}

export interface UserSearchOptions {
  searchTerm?: string;
  searchInName?: boolean;
  searchInEmail?: boolean;
  caseSensitive?: boolean;
}

export class UserService extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  /**
   * Get all users with advanced filtering
   */
  async getAllUsers(options: UserFilterOptions = {}): Promise<ServiceResponse<IUser>> {
    const {
      role,
      isActive,
      emailDomain,
      createdDateRange,
      searchTerm,
      page = 1,
      limit = 10,
      sort = { createdAt: -1 },
      ...restOptions
    } = options;

    // Build custom filters
    const customFilters: Record<string, any> = {};
    
    if (role) customFilters.role = role;
    if (isActive !== undefined) customFilters.isActive = isActive;
    
    // Email domain filter
    if (emailDomain) {
      customFilters.email = { $regex: `@${emailDomain}$`, $options: 'i' };
    }

    // Date range filter for createdAt
    let dateRange;
    if (createdDateRange) {
      dateRange = {
        field: 'createdAt',
        startDate: createdDateRange.startDate,
        endDate: createdDateRange.endDate
      };
    }

    const serviceOptions: ServiceOptions = {
      page,
      limit,
      sort,
      searchKeys: ['name', 'email'],
      searchTerm,
      hideKeys: ['password'], // Always hide password
      customFilters,
      dateRange,
      ...restOptions
    };

    return await this.findAll(serviceOptions);
  }

  /**
   * Get active users only
   */
  async getActiveUsers(options: Omit<UserFilterOptions, 'isActive'> = {}): Promise<ServiceResponse<IUser>> {
    return await this.getAllUsers({
      ...options,
      isActive: true
    });
  }

  /**
   * Get inactive users only
   */
  async getInactiveUsers(options: Omit<UserFilterOptions, 'isActive'> = {}): Promise<ServiceResponse<IUser>> {
    return await this.getAllUsers({
      ...options,
      isActive: false
    });
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: 'USER' | 'ADMIN', options: Omit<UserFilterOptions, 'role'> = {}): Promise<ServiceResponse<IUser>> {
    return await this.getAllUsers({
      ...options,
      role
    });
  }

  /**
   * Search users with advanced options
   */
  async searchUsers(searchOptions: UserSearchOptions & UserFilterOptions): Promise<ServiceResponse<IUser>> {
    const { searchTerm, searchInName = true, searchInEmail = true, caseSensitive = false, ...filterOptions } = searchOptions;

    if (!searchTerm) {
      return await this.getAllUsers(filterOptions);
    }

    // Build search keys based on options
    const searchKeys: string[] = [];
    if (searchInName) searchKeys.push('name');
    if (searchInEmail) searchKeys.push('email');

    // If case sensitive search is needed, we'll use a different approach
    let preFilter = {};
    if (caseSensitive && searchTerm) {
      const searchConditions = [];
      if (searchInName) searchConditions.push({ name: { $regex: searchTerm } });
      if (searchInEmail) searchConditions.push({ email: { $regex: searchTerm } });
      
      if (searchConditions.length > 0) {
        preFilter = { $or: searchConditions };
      }
    }

    return await this.getAllUsers({
      ...filterOptions,
      searchKeys: caseSensitive ? [] : searchKeys,
      searchTerm: caseSensitive ? undefined : searchTerm,
      preFilter: caseSensitive ? preFilter : {}
    });
  }

  /**
   * Get user by email (without password)
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({ email: email.toLowerCase() }, ['password']);
  }

  /**
   * Get user by email (with password for authentication)
   */
  async getUserByEmailWithPassword(email: string): Promise<IUser | null> {
    return await this.findOne({ email: email.toLowerCase() });
  }

  /**
   * Create user with password hashing
   */
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    if (userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }
    
    if (userData.email) {
      userData.email = userData.email.toLowerCase();
    }

    return await this.create(userData);
  }

  /**
   * Update user password
   */
  async updateUserPassword(userId: string, newPassword: string): Promise<IUser | null> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    return await this.updateById(userId, { password: hashedPassword } as Partial<IUser>);
  }

  /**
   * Activate/Deactivate user
   */
  async toggleUserStatus(userId: string): Promise<IUser | null> {
    const user = await this.findById(userId);
    if (!user) return null;

    return await this.updateById(userId, { isActive: !user.isActive } as Partial<IUser>);
  }

  /**
   * Bulk activate users
   */
  async activateUsers(userIds: string[]): Promise<{ matchedCount: number; modifiedCount: number }> {
    return await this.updateMany(
      { _id: { $in: userIds } },
      { isActive: true } as Partial<IUser>
    );
  }

  /**
   * Bulk deactivate users
   */
  async deactivateUsers(userIds: string[]): Promise<{ matchedCount: number; modifiedCount: number }> {
    return await this.updateMany(
      { _id: { $in: userIds } },
      { isActive: false } as Partial<IUser>
    );
  }

  /**
   * Get users by email domain
   */
  async getUsersByEmailDomain(domain: string, options: Omit<UserFilterOptions, 'emailDomain'> = {}): Promise<ServiceResponse<IUser>> {
    return await this.getAllUsers({
      ...options,
      emailDomain: domain
    });
  }

  /**
   * Get recently created users (last N days)
   */
  async getRecentUsers(days: number = 7, options: UserFilterOptions = {}): Promise<ServiceResponse<IUser>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await this.getAllUsers({
      ...options,
      createdDateRange: {
        startDate,
        endDate: new Date()
      }
    });
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
    byEmailDomain: { domain: string; count: number }[];
  }> {
    const baseStats = await this.getStats();
    
    const [adminCount, userCount, emailDomains] = await Promise.all([
      this.count({ role: 'ADMIN' }),
      this.count({ role: 'USER' }),
      this.aggregate([
        {
          $group: {
            _id: {
              $regex: /@(.+)$/,
              $options: 'i'
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    return {
      total: baseStats.total ?? 0,
      active: baseStats.active ?? 0,
      inactive: baseStats.inactive ?? 0,
      recentlyCreated: baseStats.recentlyCreated ?? 0,
      recentlyUpdated: baseStats.recentlyUpdated ?? 0,
      admins: adminCount,
      users: userCount,
      byEmailDomain: emailDomains.map((item: any) => ({
        domain: item._id,
        count: item.count
      }))
    };
  }

  /**
   * Check if user exists by email
   */
  async userExistsByEmail(email: string): Promise<boolean> {
    return await this.exists({ email: email.toLowerCase() });
  }

  /**
   * Validate user password
   */
  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.getUserByEmailWithPassword(email);
    if (!user) return false;

    return await bcrypt.compare(password, user.password);
  }

  /**
   * Get users with pagination and sorting options
   */
  async getUsersPaginated(
    page: number = 1,
    limit: number = 10,
    sortField: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    filters: Partial<IUser> = {}
  ): Promise<ServiceResponse<IUser>> {
    const sort: Record<string, 1 | -1> = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
    
    return await this.getAllUsers({
      page,
      limit,
      sort,
      customFilters: filters
    });
  }

  /**
   * Export users data (without passwords)
   */
  async exportUsers(filters: UserFilterOptions = {}): Promise<IUser[]> {
    const result = await this.getAllUsers({
      ...filters,
      page: 1,
      limit: 999999, // Get all matching records
      hideKeys: ['password']
    });
    
    return result.data;
  }
}