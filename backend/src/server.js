import mongoose from 'mongoose';

import app from './app.js';
import { connectDB } from './config/db.js';
import { config, validateEnv } from './config/env.js';
import { scrapeHackerNewsTopStories } from './services/scraperService.js';

validateEnv();
await connectDB(config.mongoUri);

const server = app.listen(config.port, async () => {
  console.log(`API running on port ${config.port}`);

  if (config.runScraperOnStartup) {
    try {
      const result = await scrapeHackerNewsTopStories(10);
      console.log(`Startup scrape complete: ${result.scrapedCount} stories processed`);
    } catch (error) {
      console.error(`Startup scrape failed: ${error.message}`);
    }
  }
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Closing server.`);
  server.close(async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (error) => {
  console.error(`Unhandled rejection: ${error.message}`);
  server.close(() => process.exit(1));
});
