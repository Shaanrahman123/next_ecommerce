import { Model, Document, FilterQuery } from 'mongoose';

export interface PaginationResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function paginate<T extends Document>(
  model: Model<T>,
  filter: FilterQuery<T> = {},
  pageInput: string | number | null = 1,
  limitInput: string | number | null = 10,
  sort: any = { createdAt: -1 },
  populate: any = null
): Promise<PaginationResult<T>> {
  // Normalize page and limit parameters
  const page = Math.max(1, parseInt(pageInput?.toString() || '1', 10));
  const limit = Math.max(1, parseInt(limitInput?.toString() || '10', 10));
  const skip = (page - 1) * limit;

  // Build the mongoose query
  let query = model.find(filter).sort(sort).skip(skip).limit(limit);
  if (populate) {
    query = query.populate(populate);
  }

  // Execute database count and query concurrently
  const [totalDocs, docs] = await Promise.all([
    model.countDocuments(filter),
    query
  ]);

  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    docs,
    totalDocs,
    limit,
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
}
