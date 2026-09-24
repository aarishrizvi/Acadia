import React, { useState } from 'react';
import { Star, X, Send, AlertCircle } from 'lucide-react';
import { Course, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import { submitReview } from '../services/dataService';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onReviewSubmitted: (newReview: Review) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  course,
  onReviewSubmitted,
}) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please sign in or use a demo profile to submit a review.');
      return;
    }
    if (!title.trim() || !comment.trim()) {
      setError('Please provide both a headline and review commentary.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const createdReview = await submitReview({
        courseId: course.id,
        academyId: course.academyId,
        userId: currentUser.id,
        userName: currentUser.displayName,
        userPhoto: currentUser.photoURL,
        rating,
        title: title.trim(),
        comment: comment.trim(),
      });

      onReviewSubmitted(createdReview);
      onClose();
    } catch (err: any) {
      console.error('Failed to submit review:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-1">Rate &amp; Review Course</h3>
        <p className="text-sm text-slate-400 mb-5">{course.title}</p>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Your Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-slate-600 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-semibold text-amber-400">
                {(hoverRating || rating)} / 5
              </span>
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Review Headline
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Masterclass in software architecture!"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Detailed Feedback
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you learn? How were the lessons, exercises, and instructor guidance?"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
