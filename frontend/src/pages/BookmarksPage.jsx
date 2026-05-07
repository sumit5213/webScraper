import { useCallback, useEffect, useState } from 'react';

import api, { getApiErrorMessage } from '../api/client.js';
import Alert from '../components/Alert.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import Pagination from '../components/Pagination.jsx';
import StoryCard from '../components/StoryCard.jsx';

const BookmarksPage = () => {
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/bookmarks', {
        params: {
          page,
          limit: 10,
          sortBy: 'postedAt',
          order: 'desc'
        }
      });

      setStories(response.data.data);
      setPagination(response.data.pagination);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load bookmarks'));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return (
    <section className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">Saved reading</p>
        <h1>Your bookmarks</h1>
      </div>

      {error ? <Alert>{error}</Alert> : null}

      {loading ? (
        <LoadingState label="Loading bookmarks" />
      ) : stories.length > 0 ? (
        <>
          <div className="story-list">
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} bookmarked />
            ))}
          </div>
          <Pagination pagination={pagination} onPageChange={setPage} disabled={loading} />
        </>
      ) : (
        <EmptyState title="No bookmarks yet">
          Save stories from the front page and they will collect here.
        </EmptyState>
      )}
    </section>
  );
};

export default BookmarksPage;
