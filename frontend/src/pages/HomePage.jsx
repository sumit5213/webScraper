import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import api, { getApiErrorMessage } from '../api/client.js';
import Alert from '../components/Alert.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import Pagination from '../components/Pagination.jsx';
import StoryCard from '../components/StoryCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('postedAt');
  const [order, setOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [bookmarkingId, setBookmarkingId] = useState('');
  const [savedIds, setSavedIds] = useState(() => new Set());

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      sortBy,
      order
    }),
    [order, page, sortBy]
  );

  const fetchStories = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/stories', { params });
      setStories(response.data.data);
      setPagination(response.data.pagination);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load stories'));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleScrape = async () => {
    setScraping(true);
    setError('');
    setNotice('');

    try {
      const response = await api.post('/scrape');
      setNotice(response.data.message);
      setPage(1);
      await fetchStories();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to scrape Hacker News'));
    } finally {
      setScraping(false);
    }
  };

  const handleBookmark = async (story) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setBookmarkingId(story._id);
    setError('');

    try {
      await api.post(`/stories/${story._id}/bookmark`);
      setSavedIds((current) => {
        const next = new Set(current);
        next.add(story._id);
        return next;
      });
      setNotice('Story saved to bookmarks');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to bookmark story'));
    } finally {
      setBookmarkingId('');
    }
  };

  const handleSortChange = (event) => {
    const [nextSortBy, nextOrder] = event.target.value.split(':');
    setSortBy(nextSortBy);
    setOrder(nextOrder);
    setPage(1);
  };

  return (
    <section className="page-stack">
      <div className="reader-hero">
        <div>
          <p className="eyebrow">Hacker News top 10</p>
          <h1>Track the technical stories worth coming back to.</h1>
          <p>
            Scrape the current front page, scan by points or recency, and keep a personal reading list.
          </p>
        </div>
        <button className="primary-button" type="button" onClick={handleScrape} disabled={scraping}>
          <RefreshCw className={scraping ? 'spin' : ''} size={18} aria-hidden="true" />
          {scraping ? 'Scraping' : 'Scrape latest'}
        </button>
      </div>

      <div className="toolbar">
        <label className="select-field">
          <span>Sort</span>
          <select value={`${sortBy}:${order}`} onChange={handleSortChange}>
            <option value="postedAt:desc">Newest first</option>
            <option value="postedAt:asc">Oldest first</option>
            <option value="points:desc">Most points</option>
            <option value="points:asc">Fewest points</option>
            <option value="title:asc">Title A to Z</option>
          </select>
        </label>
      </div>

      {notice ? <Alert tone="success">{notice}</Alert> : null}
      {error ? <Alert>{error}</Alert> : null}

      {loading ? (
        <LoadingState label="Loading stories" />
      ) : stories.length > 0 ? (
        <>
          <div className="story-list">
            {stories.map((story) => (
              <StoryCard
                key={story._id}
                story={story}
                bookmarked={savedIds.has(story._id)}
                bookmarking={bookmarkingId === story._id}
                onBookmark={handleBookmark}
              />
            ))}
          </div>
          <Pagination pagination={pagination} onPageChange={setPage} disabled={loading} />
        </>
      ) : (
        <EmptyState title="No stories yet">
          Run a scrape to pull the latest top stories from Hacker News.
        </EmptyState>
      )}
    </section>
  );
};

export default HomePage;
