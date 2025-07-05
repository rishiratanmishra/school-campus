import mongoose, { Model, Document, FilterQuery, SortOrder } from 'mongoose';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, SortOrder>;
}

// Updated to match your middleware structure
export interface AuthUser {
  _id: string;
  name?: string | { first?: string; middle?: string; last?: string };
  role?: string;
  organisation?: {
    _id: string;
    name?: string;
  };
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
   * Helper method to format user name properly
   */
  private formatUserName(
    name?: string | { first?: string; middle?: string; last?: string }
  ): string {
    if (!name) return '';

    // If name is already a string, check if it's a stringified object
    if (typeof name === 'string') {
      // Try to parse if it looks like a stringified object
      if (name.startsWith('{') && name.includes('first')) {
        try {
          // Use a safer approach to parse the stringified object
          const jsonString = name
            .replace(/'/g, '"') // Replace single quotes with double quotes
            .replace(/(\w+):/g, '"$1":'); // Add quotes around property names

          const parsed = JSON.parse(jsonString);
          if (parsed && typeof parsed === 'object') {
            const parts = [];
            if (parsed.first) parts.push(parsed.first);
            if (parsed.middle) parts.push(parsed.middle);
            if (parsed.last) parts.push(parsed.last);
            return parts.join(' ');
          }
        } catch (e) {
          // If parsing fails, try regex extraction as fallback
          const firstMatch = name.match(/first:\s*'([^']+)'/);
          const middleMatch = name.match(/middle:\s*'([^']+)'/);
          const lastMatch = name.match(/last:\s*'([^']+)'/);

          const parts = [];
          if (firstMatch) parts.push(firstMatch[1]);
          if (middleMatch) parts.push(middleMatch[1]);
          if (lastMatch) parts.push(lastMatch[1]);

          return parts.length > 0 ? parts.join(' ') : name;
        }
      }
      return name;
    }

    // If name is an object with first, middle, last properties
    if (typeof name === 'object') {
      const parts = [];
      if (name.first) parts.push(name.first);
      if (name.middle) parts.push(name.middle);
      if (name.last) parts.push(name.last);
      return parts.join(' ');
    }

    return '';
  }

  /**
   * Helper method to create user object with proper ObjectId conversion
   */
  private createUserObject(user: AuthUser) {
    return {
      _id: new mongoose.Types.ObjectId(user._id),
      name: this.formatUserName(user.name),
    };
  }

  /**
   * Helper method to create organisation object with proper ObjectId conversion
   */
  private createOrganisationObject(organisation: {
    _id: string;
    name?: string;
  }) {
    return {
      _id: new mongoose.Types.ObjectId(organisation._id),
      name: organisation.name || '',
    };
  }

  /**
   * Create a new document
   */
  async create(data: Partial<T>, user?: AuthUser): Promise<T> {
    console.log('BaseService.create called with user:', user);

    const documentData: any = { ...data };

    if (user) {
      if (user.organisation) {
        documentData.organisation = this.createOrganisationObject(
          user.organisation
        );
      }

      documentData.createdBy = this.createUserObject(user);
      documentData.updatedBy = this.createUserObject(user);
    } else {
      console.log('No user provided to BaseService.create');
    }

    console.log(
      'Final document data before create:',
      JSON.stringify(documentData, null, 2)
    );

    const createdDocument = await this.model.create(documentData);
    console.log('Document created successfully:', createdDocument);

    return createdDocument;
  }

  /**
   * Update a document by ID
   */
  async updateById(
    _id: string,
    updateData: Partial<T>,
    user?: AuthUser
  ): Promise<T | null> {
    console.log('BaseService.updateById called with user:', user);

    const dataToUpdate: any = { ...updateData };

    if (user) {
      console.log('Adding updated user information');

      // Add organisation if present (before updatedBy)
      if (user.organisation) {
        console.log('Adding organisation information:', user.organisation);
        dataToUpdate.organisation = this.createOrganisationObject(
          user.organisation
        );
      }

      // Add updatedBy information at the end with proper ObjectId conversion
      dataToUpdate.updatedBy = this.createUserObject(user);
    } else {
      console.log('No user provided to BaseService.updateById');
    }

    console.log('Final update data:', JSON.stringify(dataToUpdate, null, 2));

    const updatedDocument = await this.model.findByIdAndUpdate(
      _id,
      dataToUpdate,
      {
        new: true,
        runValidators: true,
      }
    );

    console.log('Document updated successfully:', updatedDocument);

    return updatedDocument;
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
        customFilters = {},
      } = options;

      // Build the query filter
      let queryFilter: FilterQuery<T> = { ...preFilter };

      // Apply search functionality
      if (searchTerm && searchKeys.length > 0) {
        const searchRegex = new RegExp(searchTerm, 'i');
        queryFilter.$or = searchKeys.map((key) => ({
          [key]: { $regex: searchRegex },
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
      Object.keys(customFilters).forEach((key) => {
        if (
          customFilters[key] !== undefined &&
          customFilters[key] !== null &&
          customFilters[key] !== ''
        ) {
          (queryFilter as any)[key] = customFilters[key];
        }
      });

      // Apply post filters
      queryFilter = { ...queryFilter, ...postFilter };

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build projection to hide specified keys
      const projection: Record<string, number> = {};
      hideKeys.forEach((key) => {
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
        this.model.countDocuments(queryFilter),
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
          hasPrev,
        },
        filters: {
          applied: queryFilter,
          searchTerm,
          totalFiltered: filteredCount,
        },
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
      hideKeys.forEach((key) => {
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
  async findOne(
    filter: FilterQuery<T>,
    hideKeys: string[] = []
  ): Promise<T | null> {
    try {
      const projection: Record<string, number> = {};
      hideKeys.forEach((key) => {
        projection[key] = 0;
      });

      const document = await this.model.findOne(filter, projection);
      return document;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update multiple documents
   */
  async updateMany(
    filter: FilterQuery<T>,
    updateData: Partial<T>
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      const result = await this.model.updateMany(filter, updateData);
      return {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
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
  async getDistinct(
    field: string,
    filter: FilterQuery<T> = {}
  ): Promise<any[]> {
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

      const [total, recentlyCreated, recentlyUpdated, activeCount] =
        await Promise.all([
          this.model.countDocuments(filter),
          this.model.countDocuments({
            ...filter,
            createdAt: { $gte: last30Days },
          }),
          this.model.countDocuments({
            ...filter,
            updatedAt: { $gte: last30Days },
          }),
          this.model.countDocuments({ ...filter, isActive: true }),
        ]);

      return {
        total,
        active: activeCount,
        inactive: total - activeCount,
        recentlyCreated,
        recentlyUpdated,
      };
    } catch (error) {
      throw error;
    }
  }
}
