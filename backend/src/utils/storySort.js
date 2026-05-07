const SORT_FIELDS = new Set(['postedAt', 'points', 'title', 'createdAt']);

export const buildStorySort = (query) => {
  const sortBy = SORT_FIELDS.has(query.sortBy) ? query.sortBy : 'postedAt';
  const direction = query.order === 'asc' ? 1 : -1;

  return {
    [sortBy]: direction,
    _id: -1
  };
};
