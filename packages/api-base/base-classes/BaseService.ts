import { Model, Document, FilterQuery, SortOrder } from 'mongoose';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, SortOrder>;
}

export interface FilterOptions {
  searchKeys?: string[];
  searchTerm?: string;
  hideKeys?: string[];
  preFilter?: FilterQuery<any>;
  postFilter?: FilterQuery<any>;
  dateRange?: {
    field: string;
    startDate?: Date;
    endDate?: Date;
  };
  customFilters?: Record<string, any>;
}

export interface ServiceOptions extends PaginationOptions, FilterOptions {}

export interface ServiceResponse<T> {
  data: T[];
  pagination: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    applied: Record<string, any>;
    searchTerm?: string;
    totalFiltered: number;
  };
}

export class BaseService<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Create a new document
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      const document = await this.model.create(data);
      return document;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find documents with advanced filtering and pagination
   */
  async findAll(options: ServiceOptions = {}): Promise<ServiceResponse<T>> {
    try {
      const {
        page = 1,
        limit = 10,
        sort = { createdAt: -1 },
        searchKeys = [],
        searchTerm,
        hideKeys = [],
        preFilter = {},
        postFilter = {},
        dateRange,
        customFilters = {}
      } = options;

      // Build the query filter
      let queryFilter: FilterQuery<T> = { ...preFilter };

      // Apply search functionality
      if (searchTerm && searchKeys.length > 0) {
        const searchRegex = new RegExp(searchTerm, 'i');
        queryFilter.$or = searchKeys.map(key => ({
          [key]: { $regex: searchRegex }
        })) as FilterQuery<T>[];
      }

      // Apply date range filter
      if (dateRange) {
        const { field, startDate, endDate } = dateRange;
        const dateFilter: any = {};
        
        if (startDate) {
          dateFilter.$gte = new Date(startDate);
        }
        if (endDate) {
          dateFilter.$lte = new Date(endDate);
        }
        
        if (Object.keys(dateFilter).length > 0) {
          (queryFilter as any)[field] = dateFilter;
        }
      }

      // Apply custom filters
      Object.keys(customFilters).forEach(key => {
        if (customFilters[key] !== undefined && customFilters[key] !== null && customFilters[key] !== '') {
          (queryFilter as any)[key] = customFilters[key];
        }
      });

      // Apply post filters
      queryFilter = { ...queryFilter, ...postFilter };

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build projection to hide specified keys
      const projection: Record<string, number> = {};
      hideKeys.forEach(key => {
        projection[key] = 0;
      });

      // Execute queries
      const [data, totalCount, filteredCount] = await Promise.all([
        this.model
          .find(queryFilter, projection)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        this.model.countDocuments({}),
        this.model.countDocuments(queryFilter)
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil(filteredCount / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      return {
        data: data as T[],
        pagination: {
          current: page,
          total: totalPages,
          count: data.length,
          totalRecords: filteredCount,
          hasNext,
          hasPrev
        },
        filters: {
          applied: queryFilter,
          searchTerm,
          totalFiltered: filteredCount
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a single document by ID
   */
  async findById(_id: string, hideKeys: string[] = []): Promise<T | null> {
    try {
      const projection: Record<string, number> = {};
      hideKeys.forEach(key => {
        projection[key] = 0;
      });

      const document = await this.model.findById(_id, projection);
      return document;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a single document by filter
   */
  async findOne(filter: FilterQuery<T>, hideKeys: string[] = []): Promise<T | null> {
    try {
      const projection: Record<string, number> = {};
      hideKeys.forEach(key => {
        projection[key] = 0;
      });

      const document = await this.model.findOne(filter, projection);
      return document;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a document by ID
   */
  async updateById(_id: string, updateData: Partial<T>): Promise<T | null> {
    try {
      const document = await this.model.findByIdAndUpdate(
        _id,
        updateData,
        { new: true, runValidators: true }
      );
      return document;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update multiple documents
   */
  async updateMany(filter: FilterQuery<T>, updateData: Partial<T>): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      const result = await this.model.updateMany(filter, updateData);
      return {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a document by ID
   */
  async deleteById(_id: string): Promise<T | null> {
    try {
      const document = await this.model.findByIdAndDelete(_id);
      return document;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete multiple documents
   */
  async deleteMany(filter: FilterQuery<T>): Promise<{ deletedCount: number }> {
    try {
      const result = await this.model.deleteMany(filter);
      return { deletedCount: result.deletedCount };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get distinct values for a field
   */
  async getDistinct(field: string, filter: FilterQuery<T> = {}): Promise<any[]> {
    try {
      const distinctValues = await this.model.distinct(field, filter);
      return distinctValues;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get aggregated data
   */
  async aggregate(pipeline: any[]): Promise<any[]> {
    try {
      const result = await this.model.aggregate(pipeline);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Count documents with filter
   */
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      const count = await this.model.countDocuments(filter);
      return count;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if document exists
   */
  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const document = await this.model.findOne(filter).select('_id').lean();
      return !!document;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk operations
   */
  async bulkWrite(operations: any[]): Promise<any> {
    try {
      const result = await this.model.bulkWrite(operations);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get advanced statistics
   */
  async getStats(filter: FilterQuery<T> = {}): Promise<{
    total: number;
    active?: number;
    inactive?: number;
    recentlyCreated: number;
    recentlyUpdated: number;
  }> {
    try {
      const now = new Date();
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [total, recentlyCreated, recentlyUpdated, activeCount] = await Promise.all([
        this.model.countDocuments(filter),
        this.model.countDocuments({ ...filter, createdAt: { $gte: last30Days } }),
        this.model.countDocuments({ ...filter, updatedAt: { $gte: last30Days } }),
        this.model.countDocuments({ ...filter, isActive: true })
      ]);

      return {
        total,
        active: activeCount,
        inactive: total - activeCount,
        recentlyCreated,
        recentlyUpdated
      };
    } catch (error) {
      throw error;
    }
  }
}