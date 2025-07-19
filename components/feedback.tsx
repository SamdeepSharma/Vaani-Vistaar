import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Star, Heart } from 'lucide-react';

interface FeedbackComponentProps {
  fromLanguage: string;
  toLanguage: string;
  originalText: string;
  translatedText: string;
  onFeedbackSubmitted?: () => void;
}

const ThankYouMessage = ({ rating }: { rating: number }) => {
  const messages: { [key: number]: string } = {
    5: "Thank you for your excellent feedback! We're thrilled you found the translation helpful!",
    4: "Thank you for your positive feedback! We appreciate your support!",
    3: "Thank you for your feedback! We'll work on improving our service.",
    2: "Thank you for your feedback. We'll strive to do better!",
    1: "Thank you for your feedback. We apologize for not meeting expectations."
  };

  return (
    <div className="p-8 bg-white rounded-xl border-2 border-orange-300 shadow-lg animate-fade-in">
      <div className="text-center">
        <div className="inline-block p-4 bg-orange-100 rounded-full mb-4">
          <Heart className="h-12 w-12 text-red-500 animate-pulse" />
        </div>
        
        <h3 className="text-2xl font-bold text-orange-800 mb-4">
          Thank You!
        </h3>

        <div className="flex justify-center gap-1 mb-4">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`h-6 w-6 ${
                index < rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        <p className="text-orange-700 text-lg mb-6">
          {messages[rating] || "Thank you for your feedback!"}
        </p>

        <div className="text-orange-600 text-sm">
          Your feedback helps us improve our translation service
        </div>
      </div>
    </div>
  );
};

export const FeedbackComponent = ({ 
  fromLanguage, 
  toLanguage, 
  originalText, 
  translatedText,
  onFeedbackSubmitted 
}: FeedbackComponentProps) => {
  const { data: session, status } = useSession();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until client-side mounted
  if (!isMounted) {
    return null;
  }

  if (status === "loading") {
    return (
      <div className="mt-8 p-6 bg-orange-50 rounded-xl border-2 border-orange-200">
        <div className="text-center p-4">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mt-8 p-6 bg-orange-50 rounded-xl border-2 border-orange-200">
        <div className="text-center p-4">
          <p className="text-orange-800">Please sign in to provide feedback</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          review,
          fromLanguage,
          toLanguage,
          originalText,
          translatedText,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }

      setSubmitted(true);
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(
          err.name === 'AbortError'
            ? 'Request timed out. Please try again.'
            : err.message
        );
      } else {
        setError('Failed to submit feedback. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-8">
        <ThankYouMessage rating={rating} />
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-orange-50 rounded-xl border-2 border-orange-200">
      <h3 className="text-xl font-semibold text-orange-800 mb-4">
        How was the translation?
      </h3>
      
      <div className="flex justify-center space-x-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="focus:outline-none transform hover:scale-110 transition-transform duration-200"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
          >
            <Star
              size={32}
              className={`transition-colors duration-200 ${
                star <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      <div className="mb-4">
        <textarea
          className="w-full p-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition duration-200 resize-none h-24"
          placeholder="Share your thoughts about the translation (optional)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </div>

      {error && (
        <div className="mb-4 text-red-500 text-center font-medium">
          {error}
        </div>
      )}

      <button
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 transform hover:scale-105"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </div>
        ) : (
          'Submit Feedback'
        )}
      </button>
    </div>
  );
};