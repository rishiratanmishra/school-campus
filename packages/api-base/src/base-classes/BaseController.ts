import { Request, Response } from 'express';
import { AuthUser, BaseService, ServiceOptions } from './BaseService';
import { ApiResponse } from './response';

interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export class BaseController<T> {
  protected service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
  }

  /**
   * Create new record
   */
  handleCreate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const data = await this.service.create(req.body, req.user);
      ApiResponse.success(res, 'Created successfully', data, 201);
    } catch (error: any) {
      if (error.code === 11000) {
        ApiResponse.error(res, 'Duplicate entry', 400);
      } else if (error.name === 'ValidationError') {
        ApiResponse.error(res, 'Validation failed', 400, error.message);
      } else {
        ApiResponse.error(res, 'Creation failed', 500, error.message);
      }
    }
  };

  /**
   * Get all records with advanced filtering and pagination
   */
  handleGetAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const options: ServiceOptions = this.buildServiceOptions(req);
      const result = await this.service.findAll(options);

      ApiResponse.success(res, 'Data retrieved successfully', {
        data: result.data,
        pagination: result.pagination,
        filters: result.filters
      });
    } catch (error: any) {
      console.error('GetAll error:', error);
      ApiResponse.error(res, 'Failed to retrieve data', 500, error.message);
    }
  };

  /**
   * Get single record by ID
   */
  handleGetById = async (req: Request, res: Response): Promise<void> => {
    try {
      const _id = req.params._id || req.body?._id;
      if (!_id) {
        ApiResponse.error(res, 'ID is required', 400);
        return;
      }

      const hideKeys = this.extractHideKeys(req);
      const data = await this.service.findById(_id, hideKeys);
      
      if (!data) {
        ApiResponse.error(res, 'Record not found', 404);
        return;
      }
      
      ApiResponse.success(res, 'Data retrieved successfully', data);
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to retrieve data', 500, error.message);
    }
  };

  /**
   * Update record by ID
   */
  handleUpdate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const _id = req.params._id;
      if (!_id) {
        ApiResponse.error(res, 'ID is required', 400);
        return;
      }

    const data = await this.service.updateById(_id, req.body, req.user); 
      if (!data) {
        ApiResponse.error(res, 'Record not found', 404);
        return;
      }
      
      ApiResponse.success(res, 'Updated successfully', data);
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        ApiResponse.error(res, 'Validation failed', 400, error.message);
      } else {
        ApiResponse.error(res, 'Update failed', 500, error.message);
      }
    }
  };

  /**
   * Delete record by ID
   */
  handleDelete = async (req: Request, res: Response): Promise<void> => {
    try {
      const _id = req.params._id;
      if (!_id) {
        ApiResponse.error(res, 'ID is required', 400);
        return;
      }

      const data = await this.service.deleteById(_id);
      if (!data) {
        ApiResponse.error(res, 'Record not found', 404);
        return;
      }
      
      ApiResponse.success(res, 'Deleted successfully', data);
    } catch (error: any) {
      ApiResponse.error(res, 'Delete failed', 500, error.message);
    }
  };

  /**
   * Search records
   */
  handleSearch = async (req: Request, res: Response): Promise<void> => {
    try {
      const options: ServiceOptions = this.buildServiceOptions(req);
      
      if (!options.searchTerm) {
        ApiResponse.error(res, 'Search term is required', 400);
        return;
      }

      const result = await this.service.findAll(options);
      
      ApiResponse.success(res, 'Search completed successfully', {
        results: result.data,
        pagination: result.pagination,
        filters: result.filters
      });
    } catch (error: any) {
      ApiResponse.error(res, 'Search failed', 500, error.message);
    }
  };

  /**
   * Get statistics
   */
  handleGetStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const filter = req.body?.filter || req.query?.filter || {};
      const stats = await this.service.getStats(filter);
      
      ApiResponse.success(res, 'Statistics retrieved successfully', stats);
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to get statistics', 500, error.message);
    }
  };

  /**
   * Bulk delete records
   */
  handleBulkDelete = async (req: Request, res: Response): Promise<void> => {
    try {
      const filter = req.body?.filter;
      if (!filter || Object.keys(filter).length === 0) {
        ApiResponse.error(res, 'Filter is required for bulk delete', 400);
        return;
      }

      const result = await this.service.deleteMany(filter);
      
      ApiResponse.success(res, 'Bulk delete completed', {
        deletedCount: result.deletedCount
      });
    } catch (error: any) {
      ApiResponse.error(res, 'Bulk delete failed', 500, error.message);
    }
  };

  /**
   * Bulk update records
   */
  handleBulkUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { filter, updateData } = req.body;
      
      if (!filter || !updateData) {
        ApiResponse.error(res, 'Filter and updateData are required', 400);
        return;
      }

      const result = await this.service.updateMany(filter, updateData);
      
      ApiResponse.success(res, 'Bulk update completed', {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      });
    } catch (error: any) {
      ApiResponse.error(res, 'Bulk update failed', 500, error.message);
    }
  };

  /**
   * Get count of records
   */
  handleGetCount = async (req: Request, res: Response): Promise<void> => {
    try {
      const filter = req.body?.filter || req.query?.filter || {};
      const count = await this.service.count(filter);
      
      ApiResponse.success(res, 'Count retrieved successfully', { count });
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to get count', 500, error.message);
    }
  };

  /**
   * Get distinct values
   */
  handleGetDistinct = async (req: Request, res: Response): Promise<void> => {
    try {
      const field = req.params.field || req.body?.field;
      if (!field) {
        ApiResponse.error(res, 'Field name is required', 400);
        return;
      }

      const filter = req.body?.filter || req.query?.filter || {};
      const distinctValues = await this.service.getDistinct(field, filter);
      
      ApiResponse.success(res, 'Distinct values retrieved successfully', {
        field,
        values: distinctValues
      });
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to get distinct values', 500, error.message);
    }
  };

  /**
   * Check if record exists
   */
  handleExists = async (req: Request, res: Response): Promise<void> => {
    try {
      const filter = req.body?.filter || req.query?.filter;
      if (!filter || Object.keys(filter).length === 0) {
        ApiResponse.error(res, 'Filter is required', 400);
        return;
      }

      const exists = await this.service.exists(filter);
      
      ApiResponse.success(res, 'Existence check completed', { exists });
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to check existence', 500, error.message);
    }
  };

  /**
   * Build service options from request
   */
  protected buildServiceOptions(req: Request): ServiceOptions {
    const body = req.body || {};
    const query = req.query || {};

    return {
      // Pagination
      page: parseInt(body.page || query.page || '1'),
      limit: parseInt(body.limit || query.limit || '10'),
      sort: body.sort || query.sort || { createdAt: -1 },

      // Search
      searchKeys: body.searchKeys || query.searchKeys || [],
      searchTerm: body.searchTerm || query.searchTerm,

      // Filtering
      hideKeys: this.extractHideKeys(req),
      preFilter: body.preFilter || query.preFilter || {},
      postFilter: body.postFilter || query.postFilter || {},
      customFilters: body.customFilters || query.customFilters || {},

      // Date range
      dateRange: body.dateRange || query.dateRange
    };
  }

  /**
   * Extract hideKeys from request
   */
  private extractHideKeys(req: Request): string[] {
    const body = req.body || {};
    const query = req.query || {};
    
    let hideKeys = body.hideKeys || query.hideKeys || [];
    
    // Handle comma-separated string format
    if (typeof hideKeys === 'string') {
      hideKeys = hideKeys.split(',').map((key: string) => key.trim());
    }
    
    return hideKeys;
  }
}