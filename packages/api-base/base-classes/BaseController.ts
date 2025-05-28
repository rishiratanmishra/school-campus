import { Request, Response, NextFunction } from 'express';
import { Model, Document } from 'mongoose';
import { ApiResponse } from './response';

export class BaseController<T extends Document> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  handleCreate = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.model.create(req.body);
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

  handleGetAll = async (req: Request, res: Response): Promise<void> => {
    try {
      // Safe property access with fallbacks
      const body = req.body || {};
      const query = req.query || {};

      // Get pagination parameters from body first, then query, then defaults
      const page = parseInt(body.page || query.page || '1');
      const limit = parseInt(body.limit || query.limit || '10');
      const skip = (page - 1) * limit;
      const filter = body.filter || query.filter || {};

      console.log('Pagination params:', { page, limit, skip, filter }); // Debug log

      const data = await this.model.find(filter).skip(skip).limit(limit);
      const total = await this.model.countDocuments(filter);

      const keyName = this.model.modelName.toLowerCase() + 's';

      ApiResponse.success(res, `${keyName} data retrieved successfully`, {
        [keyName]: data,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: data.length,
          totalRecords: total,
        },
      });
    } catch (error: any) {
      console.error('GetAll error:', error);
      ApiResponse.error(res, 'Failed to retrieve data', 500, error.message);
    }
  };

  handleGetById = async (req: Request, res: Response): Promise<void> => {
    try {
      // Safe property access
      const id = req.params.id || (req.body && req.body.id);
      if (!id) {
        ApiResponse.error(res, 'ID is required', 400);
        return;
      }

      const data = await this.model.findById(id);
      if (!data) {
        ApiResponse.error(res, 'Record not found', 404);
        return;
      }
      ApiResponse.success(res, 'Data retrieved successfully', data);
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to retrieve data', 500, error.message);
    }
  };

  handleUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
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

  handleDelete = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.model.findByIdAndDelete(req.params.id);
      if (!data) {
        ApiResponse.error(res, 'Record not found', 404);
        return;
      }
      ApiResponse.success(res, 'Deleted successfully', data);
    } catch (error: any) {
      ApiResponse.error(res, 'Delete failed', 500, error.message);
    }
  };
}
