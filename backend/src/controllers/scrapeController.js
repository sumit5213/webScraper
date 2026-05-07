import { scrapeHackerNewsTopStories } from '../services/scraperService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const scrapeStories = asyncHandler(async (_req, res) => {
  const result = await scrapeHackerNewsTopStories(10);

  res.status(200).json({
    status: 'success',
    message: `Scraped ${result.scrapedCount} stories from Hacker News`,
    data: result
  });
});
