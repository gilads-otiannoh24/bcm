import type { Request, Response, NextFunction } from "express";
import type { Model, Query } from "mongoose";

interface Pagination {
  next?: { page: number; limit: number };
  prev?: { page: number; limit: number };
}

interface QueryResult {
  success: boolean;
  count: number;
  pagination?: Pagination;
  data: any[];
}

export interface AdvancedResultsResponse extends Response {
  advancedResults?: QueryResult;
}

interface AdvancedOptions {
  searchableFields?: string[];
  populate?: string | string[] | object | object[] | Array<string | object>;
  defaultLimit?: number;
  defaultSort?: string;
}

const advancedResults =
  (
    model: Model<any>,
    {
      searchableFields = [],
      populate = undefined,
      defaultLimit = 25,
      defaultSort = "-createdAt",
    }: AdvancedOptions = {}
  ) =>
  async (
    req: Request,
    res: AdvancedResultsResponse,
    next: NextFunction
  ): Promise<void> => {
    let query: Query<any[], any, {}, any, "find">;

    const reqQuery = { ...req.query };
    const reservedFields = ["select", "sort", "page", "limit", "search"];
    reservedFields.forEach((param) => delete reqQuery[param]);

    // Build filtering conditions
    const filterConditions: Record<string, any> = { ...reqQuery };

    // Build search conditions
    let searchCondition = {};
    const search = (req.query.search as string)?.trim();
    if (search && searchableFields.length > 0) {
      searchCondition = {
        $or: searchableFields.map((field) => ({
          [field]: { $regex: search, $options: "i" },
        })),
      };
    }

    // Merge filters and search
    query = model.find({ ...filterConditions, ...searchCondition });

    // Field selection
    if (req.query.select) {
      const fields = (req.query.select as string).split(",").join(" ");
      query = query.select(fields);
    }

    // Sorting
    const sortBy = req.query.sort
      ? (req.query.sort as string).split(",").join(" ")
      : defaultSort;
    query = query.sort(sortBy);

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || defaultLimit;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments({
      ...filterConditions,
      ...searchCondition,
    });

    query = query.skip(startIndex).limit(limit);

    // Populate
    if (populate) {
      const populations = Array.isArray(populate) ? populate : [populate];

      populations.forEach((item) => {
        if (typeof item === "string" || typeof item === "object") {
          query = query.populate(item);
        } else {
          console.warn("Invalid populate type:", typeof item);
        }
      });
    }

    const results = await query;

    const pagination: Pagination = {};
    if (endIndex < total) pagination.next = { page: page + 1, limit };
    if (startIndex > 0) pagination.prev = { page: page - 1, limit };

    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results,
    };

    next();
  };

export default advancedResults;
