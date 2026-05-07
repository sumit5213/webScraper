import axios from 'axios';
import * as cheerio from 'cheerio';

import { config } from '../config/env.js';
import Story from '../models/Story.js';

const parsePoints = (value) => {
  const points = Number.parseInt(value?.replace(/\D/g, '') || '0', 10);
  return Number.isNaN(points) ? 0 : points;
};

const parsePostedAt = (ageElement) => {
  const titleValue = ageElement.attr('title');

  if (titleValue) {
    const [datePart] = titleValue.split(' ');
    const parsedDate = new Date(datePart);

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  return new Date();
};

const normalizeUrl = (url) => new URL(url, config.hackerNewsUrl).href;

const parseStories = (html, limit) => {
  const $ = cheerio.load(html);

  return $('.athing')
    .slice(0, limit)
    .map((_index, row) => {
      const storyRow = $(row);
      const metaRow = storyRow.next();
      const titleLink = storyRow.find('.titleline > a').first();
      const title = titleLink.text().trim();
      const rawUrl = titleLink.attr('href');

      if (!title || !rawUrl) {
        return null;
      }

      return {
        title,
        url: normalizeUrl(rawUrl),
        points: parsePoints(metaRow.find('.score').text()),
        author: metaRow.find('.hnuser').text().trim() || 'unknown',
        postedAt: parsePostedAt(metaRow.find('.age').first())
      };
    })
    .get()
    .filter(Boolean);
};

export const scrapeHackerNewsTopStories = async (limit = 10) => {
  const response = await axios.get(config.hackerNewsUrl, {
    timeout: 15000,
    headers: {
      'User-Agent': 'hn-bookmarks-assignment/1.0'
    }
  });

  const stories = parseStories(response.data, limit);

  if (stories.length === 0) {
    return {
      scrapedCount: 0,
      insertedCount: 0,
      modifiedCount: 0,
      stories: []
    };
  }

  const result = await Story.bulkWrite(
    stories.map((story) => ({
      updateOne: {
        filter: { url: story.url },
        update: { $set: story },
        upsert: true
      }
    })),
    { ordered: false }
  );

  const savedStories = await Story.find({
    url: { $in: stories.map((story) => story.url) }
  });

  const storiesByUrl = new Map(savedStories.map((story) => [story.url, story]));

  return {
    scrapedCount: stories.length,
    insertedCount: result.upsertedCount || 0,
    modifiedCount: result.modifiedCount || 0,
    stories: stories.map((story) => storiesByUrl.get(story.url)).filter(Boolean)
  };
};
