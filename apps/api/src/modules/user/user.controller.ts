import { Request, Response } from 'express';
import { UserService } from './user.service';
import { IUser, User } from './user.model';
// import { BaseController } from '../../../utils/BaseController';
// import { IUser, User } from '../model/user.model';
// import { UserService } from '../service/user.service';
// import { ApiResponse } from '../../../utils/response';
// Update the import path below to the correct relative path for your project structure.
// For example, if BaseController is in 'utils/BaseController.ts' relative to this file:
import { BaseController } from '@api-base/BaseController';
import { ApiResponse } from '@api-base/response';
export class UserController extends BaseController<IUser> {
  private userService: UserService;

  constructor() {
    super(User);
    this.userService = new UserService();
  }

  // Advanced get all users with filtering
  getAllUsersAdvanced = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        page,
        limit,
        sort,
        searchTerm,
        role,
        isActive,
        emailDomain,
        createdDateRange,
        hidePassword = true
      } = req.body;

      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sort: sort || { createdAt: -1 },
        searchTerm,
        role,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        emailDomain,
        createdDateRange: createdDateRange ? {
          startDate: createdDateRange.startDate ? new Date(createdDateRange.startDate) : undefined,
          endDate: createdDateRange.endDate ? new Date(createdDateRange.endDate) : undefined
        } : undefined,
        hideKeys: hidePassword ? ['password'] : []
      };

      const result = await this.userService.getAllUsers(options);
      ApiResponse.success(res, 'Users retrieved successfully', result);
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to retrieve users', 500, error.message);
    }
  };

  // Get active users only
  getActiveUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, searchTerm } = req.body;
      
      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        searchTerm
      };

      const result = await this.userService.getActiveUsers(options);
      ApiResponse.success(res, 'Active users retrieved successfully', result);
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to retrieve active users', 500, error.message);
    }
  };

  // Get inactive users only
  getInactiveUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, searchTerm } = req.body;
      
      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        searchTerm
      };

      const result = await this.userService.getInactiveUsers(options);
      ApiResponse.success(res, 'Inactive users retrieved successfully', result);
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to retrieve inactive users', 500, error.message);
    }
  };

  // Get users by role
  getUsersByRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { role, page, limit, searchTerm } = req.body;
      
      if (!role || !['USER', 'ADMIN'].includes(role)) {
        ApiResponse.error(res, 'Valid role (USER or ADMIN) is required', 400);
        return;
      }

      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        searchTerm
      };

      const result = await this.userService.getUsersByRole(role, options);
      ApiResponse.success(res, `${role} users retrieved successfully`, result);
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to retrieve users by role', 500, error.message);
    }
  };

  // Advanced search users
  searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        searchTerm,
        searchInName = true,
        searchInEmail = true,
        caseSensitive = false,
        page,
        limit,
        role,
        isActive
      } = req.body;

      if (!searchTerm) {
        ApiResponse.error(res, 'Search term is required', 400);
        return;
      }

      const searchOptions = {
        searchTerm,
        searchInName,
        searchInEmail,
        caseSensitive,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        role,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined
      };

      const result = await this.userService.searchUsers(searchOptions);
      ApiResponse.success(res, 'Search completed successfully', result);
    } catch (error: any) {
      ApiResponse.error(res, 'Search failed', 500, error.message);
    }
  };

  // Get user by email
  getUserByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      
      if (!email) {
        ApiResponse.error(res, 'Email is required', 400);
        return;
      }

      const user = await this.userService.getUserByEmail(email);
      
      if (!user) {
        ApiResponse.error(res, 'User not found', 404);
        return;
      }

      ApiResponse.success(res, 'User retrieved successfully', user);
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to retrieve user', 500, error.message);
    }
  };

  // Create user with service
  createUserAdvanced = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = req.body;
      
      // Check if user already exists
      if (userData.email) {
        const exists = await this.userService.userExistsByEmail(userData.email);
        if (exists) {
          ApiResponse.error(res, 'User with this email already exists', 409);
          return;
        }
      }

      const user = await this.userService.createUser(userData);
      ApiResponse.success(res, 'User created successfully', user, 201);
    } catch (error: any) {
      if (error.code === 11000) {
        ApiResponse.error(res, 'User with this email already exists', 409);
      } else if (error.name === 'ValidationError') {
        ApiResponse.error(res, 'Validation failed', 400, error.message);
      } else {
        ApiResponse.error(res, 'Failed to create user', 500, error.message);
      }
    }
  };

  // Update user password
  updatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, newPassword } = req.body;
      
      if (!userId || !newPassword) {
        ApiResponse.error(res, 'User ID and new password are required', 400);
        return;
      }

      if (newPassword.length < 6) {
        ApiResponse.error(res, 'Password must be at least 6 characters long', 400);
        return;
      }

      const user = await this.userService.updateUserPassword(userId, newPassword);
      
      if (!user) {
        ApiResponse.error(res, 'User not found', 404);
        return;
      }

      ApiResponse.success(res, 'Password updated successfully');
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to update password', 500, error.message);
    }
  };

  // Toggle user status
  toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        ApiResponse.error(res, 'User ID is required', 400);
        return;
      }

      const user = await this.userService.toggleUserStatus(userId);
      
      if (!user) {
        ApiResponse.error(res, 'User not found', 404);
        return;
      }

      ApiResponse.success(res, `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, user);
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to toggle user status', 500, error.message);
    }
  };

  // Bulk activate users
  bulkActivateUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userIds } = req.body;
      
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        ApiResponse.error(res, 'User IDs array is required', 400);
        return;
      }

      const result = await this.userService.activateUsers(userIds);
      ApiResponse.success(res, 'Users activated successfully', result);
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to activate users', 500, error.message);
    }
  };

  // Bulk deactivate users
  bulkDeactivateUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userIds } = req.body;
      
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        ApiResponse.error(res, 'User IDs array is required', 400);
        return;
      }

      const result = await this.userService.deactivateUsers(userIds);
      ApiResponse.success(res, 'Users deactivated successfully', result);
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to deactivate users', 500, error.message);
    }
  };

  // Get users by email domain
  getUsersByEmailDomain = async (req: Request, res: Response): Promise<void> => {
    try {
      const { domain, page, limit } = req.body;
      
      if (!domain) {
        ApiResponse.error(res, 'Email domain is required', 400);
        return;
      }

      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
      };

      const result = await this.userService.getUsersByEmailDomain(domain, options);
      ApiResponse.success(res, 'Users retrieved successfully', result);
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to retrieve users by email domain', 500, error.message);
    }
  };

  // Get recent users
  getRecentUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { days = 7, page, limit } = req.body;
      
      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
      };

      const result = await this.userService.getRecentUsers(parseInt(days), options);
      ApiResponse.success(res, 'Recent users retrieved successfully', result);
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to retrieve recent users', 500, error.message);
    }
  };

  // Get user statistics
  getUserStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.userService.getUserStats();
      ApiResponse.success(res, 'User statistics retrieved successfully', stats);
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to retrieve user statistics', 500, error.message);
    }
  };

  // Validate user password
  validatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        ApiResponse.error(res, 'Email and password are required', 400);
        return;
      }

      const isValid = await this.userService.validatePassword(email, password);
      
      if (isValid) {
        ApiResponse.success(res, 'Password is valid', { valid: true });
      } else {
        ApiResponse.error(res, 'Invalid email or password', 401, { valid: false });
      }
    } catch (error: any) {
      ApiResponse.error(res, 'Password validation failed', 500, error.message);
    }
  };

  // Export users
  // exportUsers = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const {
  //       role,
  //       isActive,
  //       emailDomain,
  //       createdDateRange,
  //       format = 'json'
  //     } = req.body;

  //     const filters = {
  //       role,
  //       isActive: isActive !== undefined ? Boolean(isActive) : undefined,
  //       emailDomain,
  //       createdDateRange: createdDateRange ? {
  //         startDate: createdDateRange.startDate ? new Date(createdDateRange.startDate) : undefined,
  //         endDate: createdDateRange.endDate ? new Date(createdDateRange.endDate) : undefined
  //       } : undefined
  //     };

  //     const users = await this.userService.exportUsers(filters);

  //     if (format === 'csv') {
  //       // Convert to CSV format
  //       const csvHeader = 'Name,Email,Role,Status,Created At,Updated At\n';
  //       const csvData = users.map(user => 
  //         `"${user.name}","${user.email}","${user.role}","${user.isActive ? 'Active' : 'Inactive'}","${user.createdAt}","${user.updatedAt}"`
  //       ).join('\n');
        
  //       res.setHeader('Content-Type', 'text/csv');
  //       res.setHeader('Content-Disposition', 'attachment; filename=users-export.csv');
  //       res.send(csvHeader + csvData);
  //     } else {
  //       ApiResponse.success(res, 'Users exported successfully', users);
  //     }
  //   } catch (error: any) {
  //     ApiResponse.error(res, 'Failed to export users', 500, error.message);
  //   }
  // };

  // Advanced filtering with multiple parameters
  advancedFilter = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        // Pagination
        page = 1,
        limit = 10,
        
        // Sorting
        sortField = 'createdAt',
        sortOrder = 'desc',
        
        // Search
        searchTerm,
        searchInName = true,
        searchInEmail = true,
        caseSensitive = false,
        
        // Filters
        role,
        isActive,
        emailDomain,
        
        // Date ranges
        createdAfter,
        createdBefore,
        updatedAfter,
        updatedBefore,
        
        // Advanced filters
        nameContains,
        emailContains,
        excludeIds = [],
        
        // Output options
        hideFields = ['password'],
        includeStats = false
      } = req.body;

      // Build sort object
      const sort: Record<string, 1 | -1> = { [String(sortField)]: sortOrder === 'asc' ? 1 : -1 };

      // Build date range filters
      let createdDateRange;
      if (createdAfter || createdBefore) {
        createdDateRange = {
          startDate: createdAfter ? new Date(createdAfter) : undefined,
          endDate: createdBefore ? new Date(createdBefore) : undefined
        };
      }

      // Build custom filters
      const customFilters: any = {};
      
      if (role) customFilters.role = role;
      if (isActive !== undefined) customFilters.isActive = Boolean(isActive);
      if (emailDomain) customFilters.email = { $regex: `@${emailDomain}$`, $options: 'i' };
      if (nameContains) customFilters.name = { $regex: nameContains, $options: caseSensitive ? '' : 'i' };
      if (emailContains) {
        // Handle case where emailDomain and emailContains might conflict
        if (customFilters.email) {
          customFilters.$and = [
            { email: customFilters.email },
            { email: { $regex: emailContains, $options: caseSensitive ? '' : 'i' } }
          ];
          delete customFilters.email;
        } else {
          customFilters.email = { $regex: emailContains, $options: caseSensitive ? '' : 'i' };
        }
      }
      if (excludeIds.length > 0) customFilters._id = { $nin: excludeIds };

      // Build updated date filter
      if (updatedAfter || updatedBefore) {
        const updatedFilter: any = {};
        if (updatedAfter) updatedFilter.$gte = new Date(updatedAfter);
        if (updatedBefore) updatedFilter.$lte = new Date(updatedBefore);
        customFilters.updatedAt = updatedFilter;
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        searchTerm,
        searchKeys: [] as string[],
        hideKeys: hideFields,
        customFilters,
        createdDateRange
      };

      // Add search keys based on options
      if (searchTerm) {
        if (searchInName) options.searchKeys.push('name');
        if (searchInEmail) options.searchKeys.push('email');
      }

      const result = await this.userService.getAllUsers(options);

      // Include stats if requested
      if (includeStats) {
        const stats = await this.userService.getUserStats();
        ApiResponse.success(res, 'Users retrieved successfully with stats', {
          ...result,
          stats
        });
      } else {
        ApiResponse.success(res, 'Users retrieved successfully', result);
      }
    } catch (error: any) {
      ApiResponse.error(res, 'Advanced filtering failed', 500, error.message);
    }
  };
}

export const userController = new UserController();