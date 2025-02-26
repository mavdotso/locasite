import { Review } from "@/app/types/businesses";

interface BusinessReviewsProps {
    reviews?: Review[];
}

export default function BusinessReviews({ reviews }: BusinessReviewsProps) {
    if (!reviews || reviews.length === 0) {
        return null;
    }

    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Customer Reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review, id) => (
                        <div key={id || `review-${review.author_name}-${review.rating}`} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                            <div className="flex items-center mb-4">
                                <div className="flex mr-2">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-5 h-5 ${i < Number(review.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="font-medium text-gray-700">{review.rating}/5.0</span>
                            </div>
                            <p className="text-gray-800 mb-3">{review.text}</p>
                            <p className="text-gray-600 text-sm font-medium">— {review.author_name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}