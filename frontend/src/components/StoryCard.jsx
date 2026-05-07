import { Bookmark, ExternalLink } from 'lucide-react';

const formatDate = (value) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));

const StoryCard = ({
  story,
  bookmarked = false,
  bookmarking = false,
  onBookmark
}) => (
  <article className="story-card">
    <div className="story-main">
      <div className="story-score">
        <strong>{story.points}</strong>
        <span>pts</span>
      </div>

      <div className="story-copy">
        <h2>
          <a href={story.url} target="_blank" rel="noreferrer">
            {story.title}
          </a>
        </h2>
        <div className="story-meta">
          <span>{story.author || 'unknown'}</span>
          <span>{formatDate(story.postedAt)}</span>
        </div>
      </div>
    </div>

    <div className="story-actions">
      <a className="icon-button" href={story.url} target="_blank" rel="noreferrer" title="Open story">
        <ExternalLink size={18} aria-hidden="true" />
      </a>

      {onBookmark ? (
        <button
          className={`icon-button ${bookmarked ? 'is-saved' : ''}`}
          type="button"
          onClick={() => onBookmark(story)}
          disabled={bookmarking || bookmarked}
          title={bookmarked ? 'Saved' : 'Save story'}
          aria-label={bookmarked ? 'Story saved' : 'Save story'}
        >
          <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  </article>
);

export default StoryCard;
