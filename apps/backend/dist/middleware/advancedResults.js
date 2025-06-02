"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const advancedResults = (model, { searchableFields = [], populate = undefined, defaultLimit = 25, defaultSort = "-createdAt", } = {}) => async (req, res, next) => {
    let query;
    const reqQuery = { ...req.query };
    const reservedFields = ["select", "sort", "page", "limit", "search"];
    reservedFields.forEach((param) => delete reqQuery[param]);
    // Build filtering conditions
    const filterConditions = { ...reqQuery };
    // Build search conditions
    let searchCondition = {};
    const search = req.query.search?.trim();
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
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }
    // Sorting
    const sortBy = req.query.sort
        ? req.query.sort.split(",").join(" ")
        : defaultSort;
    query = query.sort(sortBy);
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || defaultLimit;
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
            }
            else {
                console.warn("Invalid populate type:", typeof item);
            }
        });
    }
    const results = await query;
    const pagination = {};
    if (endIndex < total)
        pagination.next = { page: page + 1, limit };
    if (startIndex > 0)
        pagination.prev = { page: page - 1, limit };
    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results,
    };
    next();
};
exports.default = advancedResults;
