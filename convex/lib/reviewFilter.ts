

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

function parseRating(ratingStr: string): number {
	if (!ratingStr) return 0;

	const match = ratingStr.match(/(\d+)/);
	if (match) {
		const rating = parseInt(match[1]);

		return Math.min(Math.max(rating, 1), 5);
	}

	const stars = (ratingStr.match(/★/g) || []).length;
	if (stars > 0) return Math.min(stars, 5);

	return 3; // Default to neutral
}

export function filterReviews(
	reviews: Review[],
	maxReviews: number = 10
): FilteredReview[] {
	if (!reviews || reviews.length === 0) {
		return [];
	}

	const scored = reviews.map(review => {
		const wordCount = review.text.trim().split(/\s+/).length;
		const rating = parseRating(review.rating);

		let score = 0;

		score += (rating / 5) * 0.4;

		if (wordCount >= 20) {
			score += 0.4;
		} else if (wordCount >= 10) {
			score += (wordCount / 20) * 0.4;
		}

		const hasDetails = /\b(staff|service|quality|recommend|experience)\b/i.test(review.text);
		if (hasDetails) score += 0.2;

		const helpful = wordCount >= 5 &&
			!/^(.)\1{5,}/.test(review.text) && // No repeated chars
			!(review.text === review.text.toUpperCase() && wordCount > 5); // Not all caps

		return {
			...review,
			score: Math.min(score, 1),
			relevance: 0.5, // Simplified - not calculating complex relevance
			helpful
		};
	});

	return scored
		.filter(r => r.helpful && r.score > 0.2)
		.sort((a, b) => b.score - a.score)
		.slice(0, maxReviews);
}

export function getReviewStats(reviews: Review[]) {
	if (!reviews || reviews.length === 0) {
		return {
			totalReviews: 0,
			averageRating: 0,
			ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
		};
	}

	const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
	let sum = 0;
	let count = 0;

	reviews.forEach(review => {
		const rating = parseRating(review.rating);
		if (rating >= 1 && rating <= 5) {
			distribution[rating as keyof typeof distribution]++;
			sum += rating;
			count++;
		}
	});

	return {
		totalReviews: reviews.length,
		averageRating: count > 0 ? sum / count : 0,
		ratingDistribution: distribution
	};
}