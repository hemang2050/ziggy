import React from 'react';
import { Star, ThumbsUp } from 'lucide-react';

export const ReviewCard = ({ review }) => {
  const { user, rating, date, content, helpful, images = [] } = review;

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-center mb-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h4 className="font-medium text-gray-800">{user.name}</h4>
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < rating ? "text-yellow-400" : "text-gray-300"}
                  fill={i < rating ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-sm text-gray-600">{date}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-3">{content}</p>

      {images.length > 0 && (
        <div className="flex gap-2 mb-3">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>
      )}

      <div className="flex items-center text-sm text-gray-600">
        <button className="flex items-center hover:text-blue-600">
          <ThumbsUp size={16} className="mr-1" />
          Helpful ({helpful})
        </button>
      </div>
    </div>
  );
};

const ReviewSection = ({ reviews }) => {
  const calculateAverageRating = () => {
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div className="py-6">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Guest Reviews</h3>
        <div className="flex items-center">
          <div className="flex items-center">
            <Star size={24} className="text-yellow-400" fill="currentColor" />
            <span className="ml-2 text-xl font-semibold">{calculateAverageRating()}</span>
          </div>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-gray-600">{reviews.length} reviews</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </div>
    </div>
  );
};



