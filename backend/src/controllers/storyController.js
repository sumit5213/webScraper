import Story from '../models/Story.js';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPaginationParams, paginationMeta } from '../utils/pagination.js';
import { buildStorySort } from '../utils/storySort.js';

export const getStories = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const sort = buildStorySort(req.query);

  const [stories, total] = await Promise.all([
    Story.find({}).sort(sort).skip(skip).limit(limit),
    Story.countDocuments()
  ]);

  res.status(200).json({
    status: 'success',
    results: stories.length,
    data: stories,
    pagination: paginationMeta({ page, limit, total })
  });
});

export const getStoryById = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    throw new AppError('Story not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: story
  });
});

export const bookmarkStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    throw new AppError('Story not found', 404);
  }

  await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { bookmarks: story._id } },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Story bookmarked',
    data: story
  });
});
