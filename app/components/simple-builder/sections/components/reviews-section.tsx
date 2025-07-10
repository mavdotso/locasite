"use client";

import { Star } from "lucide-react";
import { getBusinessCategoryTheme } from "../../core/business-category-themes";

interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
}

interface ReviewsSectionProps {
  title?: string;
  subtitle?: string;
  reviews?: Review[];
  editMode?: boolean;
  onUpdate?: (content: Record<string, unknown>) => void;
  businessCategory?: string;
  styleOverrides?: React.CSSProperties;
}

export default function ReviewsSection({
  title = "Customer Reviews",
  subtitle,
  reviews = [],
  businessCategory,
  styleOverrides,
}: ReviewsSectionProps) {
  // Get theme based on business category
  const categoryTheme = getBusinessCategoryTheme(businessCategory);
  const themeColors = categoryTheme.colors;
  const reviewStyles = categoryTheme.sectionStyles.reviews;
  const getCardStyles = () => {
    switch (reviewStyles.cardStyle) {
      case "minimal":
        return "p-6";
      case "quote":
        return "p-6 rounded-lg border-l-4";
      case "bubble":
        return "p-6 rounded-2xl shadow-lg";
      case "elegant":
        return "p-6 rounded-lg shadow-md border";
      default:
        return "p-6 rounded-lg border";
    }
  };

  return (
    <div
      className="py-20 px-4"
      style={styleOverrides}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: themeColors.textPrimary }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg" style={{ color: themeColors.textSecondary }}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={review.id || `review-${index}`}
              className={getCardStyles()}
              style={{
                backgroundColor: themeColors.cardBackground,
                borderColor:
                  reviewStyles.cardStyle === "quote"
                    ? reviewStyles.starColor
                    : themeColors.cardBorder,
              }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={`star-${review.id || index}-${i}`}
                    className={`h-5 w-5`}
                    style={{
                      fill:
                        i < review.rating
                          ? reviewStyles.starColor
                          : "transparent",
                      color:
                        i < review.rating
                          ? reviewStyles.starColor
                          : themeColors.textSecondary + "30",
                    }}
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 line-clamp-4">
                &ldquo;{review.content}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{review.author}</p>
                <p className="text-sm text-muted-foreground">{review.date}</p>
              </div>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No reviews yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
