import { Review } from "@/app/types/businesses";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils";

interface BusinessReviewsProps {
    reviews?: Review[];
    className?: string;
}

export default function BusinessReviews({ reviews, className }: BusinessReviewsProps) {
    if (!reviews || reviews.length === 0) {
        return null;
    }

    return (
        <section className={cn("bg-background py-12", className)}>
            <div className="mx-auto px-4 container">
                <h2 className="mb-8 font-bold text-3xl text-center">Customer Reviews</h2>
                <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review, id) => (
                        <Card key={id || `review-${review.author_name}-${review.rating}`} className="bg-card/5 hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex items-center">
                                    <div className="flex mr-2">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-5 h-5 ${i < Number(review.rating) ? 'text-yellow-400' : 'text-muted-foreground/50'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="font-medium text-foreground">{review.rating}/5.0</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-3 text-foreground">
                                    {(() => {
                                        const reviewAsRecord = review as Record<string, unknown>;
                                        
                                        const reviewText = reviewAsRecord.textValue || 
                                                          reviewAsRecord.review_text || 
                                                          reviewAsRecord.content || 
                                                          reviewAsRecord.description || 
                                                          review.text || 
                                                          'No review text found in BusinessReviews';
                                        
                                        return String(reviewText);
                                    })()}
                                </p>
                                <p className="font-medium text-muted-foreground text-sm">— {review.author_name}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}