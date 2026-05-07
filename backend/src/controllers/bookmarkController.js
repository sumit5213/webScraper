import Story from '../models/Story.js';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPaginationParams, paginationMeta } from '../utils/pagination.js';
import { buildStorySort } from '../utils/storySort.js';

export const getBookmarks = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const sort = buildStorySort(req.query);

  const user = await User.findById(req.user._id).select('bookmarks');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const total = user.bookmarks.length;
  const stories = await Story.find({ _id: { $in: user.bookmarks } })
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: 'success',
    results: stories.length,
    data: stories,
    pagination: paginationMeta({ page, limit, total })
  });
});
