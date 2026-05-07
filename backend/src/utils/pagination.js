const clampNumber = (value, fallback, min, max) => {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
};

export const getPaginationParams = (query) => {
  const page = clampNumber(query.page, 1, 1, 100000);
  const limit = clampNumber(query.limit, 10, 1, 50);

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
};

export const paginationMeta = ({ page, limit, total }) => {
  const pages = Math.max(Math.ceil(total / limit), 1);

  return {
    page,
    limit,
    total,
    pages,
    hasNextPage: page < pages,
    hasPrevPage: page > 1
  };
};
