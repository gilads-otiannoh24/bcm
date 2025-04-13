import type { Request, Response, NextFunction } from "express";
import type { Model, Query } from "mongoose";

interface QueryResult {
  success: boolean;
  count: number;
  pagination?: {
    next?: {
      page: number;
      limit: number;
    };
    prev?: {
      page: number;
      limit: number;
    };
  };
  data: any[];
}

export interface AdvancedResultsResponse extends Response {
  advancedResults?: QueryResult;
}

const advancedResults =
  (model: Model<any>, populate?: string | string[] | object | object[]) =>
  async (
    req: Request,
    res: AdvancedResultsResponse,
    next: NextFunction
  ): Promise<void> => {
    let query: Query<any[], any, {}, any, "find">;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    query = model.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
      const fields = (req.query.select as string).split(",").join(" ");
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = Number.parseInt(req.query.page as string, 10) || 1;
    const limit = Number.parseInt(req.query.limit as string, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach((item) => {
          query = query.populate(item);
        });
      } else {
        // @ts-ignore
        query = query.populate(populate);
      }
    }

    // Executing query
    const results = await query;

    // Pagination result
    const pagination: QueryResult["pagination"] = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results,
    };

    next();
  };

export default advancedResults;
