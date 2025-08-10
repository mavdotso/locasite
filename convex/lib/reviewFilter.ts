// Review filtering and scoring utility

export interface Review {
  reviewer: string;
  rating: string;
  text: string;
}

export interface FilteredReview extends Review {
  score: number;
  relevance: number;
  helpful: boolean;
}

// Keywords that indicate high-quality, informative reviews
const QUALITY_KEYWORDS = [
  'excellent', 'amazing', 'professional', 'friendly', 'clean', 'efficient',
  'recommend', 'best', 'great', 'wonderful', 'fantastic', 'outstanding',
  'helpful', 'knowledgeable', 'prompt', 'reliable', 'affordable', 'quality'
];

// Keywords that might indicate less helpful reviews
const LOW_QUALITY_INDICATORS = [
  'ok', 'fine', 'whatever', 'meh', 'idk', 'dunno', '...'
];

// Minimum word count for a meaningful review
const MIN_WORD_COUNT = 10;
const PREFERRED_WORD_COUNT = 20;

/**
 * Filter and score reviews based on quality and relevance
 * @param reviews Array of reviews to filter
 * @param maxReviews Maximum number of reviews to return
 * @returns Filtered and scored reviews
 */
export function filterReviews(reviews: Review[], maxReviews: number = 10): FilteredReview[] {
  if (!reviews || reviews.length === 0) {
    return [];
  }

  // Score and filter reviews
  const scoredReviews = reviews.map(review => {
    const score = calculateReviewScore(review);
    const relevance = calculateRelevance(review);
    const helpful = isHelpfulReview(review);
    
    return {
      ...review,
      score,
      relevance,
      helpful
    };
  });

  // Sort by score (highest first) and filter out low-quality reviews
  const filteredReviews = scoredReviews
    .filter(review => review.score > 0.3 && review.helpful)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxReviews);

  // Ensure we have a good mix of ratings if possible
  return balanceRatings(filteredReviews, scoredReviews, maxReviews);
}

/**
 * Calculate a quality score for a review (0-1)
 */
function calculateReviewScore(review: Review): number {
  let score = 0;
  
  // Parse rating (assuming format like "5 stars" or just "5")
  const ratingMatch = review.rating.match(/(\d+)/);
  const rating = ratingMatch ? parseInt(ratingMatch[1]) : 3;
  
  // Base score from rating (normalized to 0-0.3)
  score += (rating / 5) * 0.3;
  
  // Word count score (0-0.3)
  const wordCount = review.text.split(/\s+/).length;
  if (wordCount >= PREFERRED_WORD_COUNT) {
    score += 0.3;
  } else if (wordCount >= MIN_WORD_COUNT) {
    score += (wordCount / PREFERRED_WORD_COUNT) * 0.3;
  }
  
  // Quality keyword score (0-0.2)
  const lowerText = review.text.toLowerCase();
  const qualityKeywordCount = QUALITY_KEYWORDS.filter(keyword => 
    lowerText.includes(keyword)
  ).length;
  score += Math.min(qualityKeywordCount * 0.05, 0.2);
  
  // Specificity score (mentions specific services, staff, etc.) (0-0.2)
  const hasSpecificMentions = /\b(staff|service|food|atmosphere|price|location|parking|wait|clean)\b/i.test(review.text);
  if (hasSpecificMentions) {
    score += 0.2;
  }
  
  // Penalize low-quality indicators
  const hasLowQualityIndicators = LOW_QUALITY_INDICATORS.some(indicator => 
    lowerText.includes(indicator)
  );
  if (hasLowQualityIndicators) {
    score *= 0.7;
  }
  
  // Penalize very short reviews
  if (wordCount < 5) {
    score *= 0.5;
  }
  
  return Math.min(score, 1);
}

/**
 * Calculate relevance score based on recency and engagement
 */
function calculateRelevance(review: Review): number {
  // Since we don't have timestamps, we'll use position as a proxy
  // This can be enhanced when timestamp data is available
  return 0.5; // Default relevance
}

/**
 * Determine if a review is helpful based on content
 */
function isHelpfulReview(review: Review): boolean {
  const wordCount = review.text.split(/\s+/).length;
  
  // Too short to be helpful
  if (wordCount < 5) {
    return false;
  }
  
  // Check if it's just repetitive characters or spam
  if (/^(.)\1{5,}/.test(review.text)) {
    return false;
  }
  
  // Check for all caps (might be spam or low quality)
  const upperCaseRatio = (review.text.match(/[A-Z]/g) || []).length / review.text.length;
  if (upperCaseRatio > 0.8 && review.text.length > 10) {
    return false;
  }
  
  return true;
}

/**
 * Ensure a balanced mix of ratings in the final selection
 */
function balanceRatings(
  filteredReviews: FilteredReview[],
  allScoredReviews: FilteredReview[],
  maxReviews: number
): FilteredReview[] {
  // Group reviews by rating
  const byRating = new Map<number, FilteredReview[]>();
  
  allScoredReviews.forEach(review => {
    const ratingMatch = review.rating.match(/(\d+)/);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 3;
    if (!byRating.has(rating)) {
      byRating.set(rating, []);
    }
    byRating.get(rating)!.push(review);
  });
  
  // If we have mostly high ratings, try to include some lower ones for balance
  const highRatingCount = filteredReviews.filter(r => {
    const rating = parseInt(r.rating.match(/(\d+)/)?.[1] || '0');
    return rating >= 4;
  }).length;
  
  if (highRatingCount > maxReviews * 0.8) {
    // Try to include some 3-star reviews if available
    const balanced: FilteredReview[] = [...filteredReviews.slice(0, Math.floor(maxReviews * 0.7))];
    
    // Add some mid-range reviews
    const midRangeReviews = allScoredReviews
      .filter(r => {
        const rating = parseInt(r.rating.match(/(\d+)/)?.[1] || '0');
        return rating === 3 && r.helpful && r.score > 0.2;
      })
      .slice(0, Math.floor(maxReviews * 0.3));
    
    balanced.push(...midRangeReviews);
    
    return balanced.slice(0, maxReviews);
  }
  
  return filteredReviews;
}

/**
 * Get review statistics
 */
export function getReviewStats(reviews: Review[]) {
  if (!reviews || reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }
  
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRating = 0;
  
  reviews.forEach(review => {
    const ratingMatch = review.rating.match(/(\d+)/);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0;
    if (rating >= 1 && rating <= 5) {
      ratingDistribution[rating as keyof typeof ratingDistribution]++;
      totalRating += rating;
    }
  });
  
  return {
    totalReviews: reviews.length,
    averageRating: totalRating / reviews.length,
    ratingDistribution
  };
}