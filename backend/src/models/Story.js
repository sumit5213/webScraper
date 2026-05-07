import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Story title is required'],
      trim: true,
      maxlength: [220, 'Story title cannot exceed 220 characters']
    },
    url: {
      type: String,
      required: [true, 'Story URL is required'],
      trim: true,
      unique: true
    },
    points: {
      type: Number,
      default: 0,
      min: [0, 'Points cannot be negative']
    },
    author: {
      type: String,
      trim: true,
      default: 'unknown'
    },
    postedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

storySchema.index({ postedAt: -1 });
storySchema.index({ points: -1 });

const Story = mongoose.model('Story', storySchema);

export default Story;
