import express from 'express';

import { bookmarkStory, getStories, getStoryById } from '../controllers/storyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router.get('/', getStories);
router.get('/:id', validateObjectId('id'), getStoryById);
router.post('/:id/bookmark', protect, validateObjectId('id'), bookmarkStory);

export default router;
