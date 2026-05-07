import express from 'express';

import { getBookmarks } from '../controllers/bookmarkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getBookmarks);

export default router;
