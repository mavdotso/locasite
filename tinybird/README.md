# Tinybird Analytics Integration

This directory contains the Tinybird configuration for Locasite's analytics system.

## Setup

1. **Install Tinybird CLI**:

   ```bash
   curl https://tinybird.co | sh
   ```

2. **Authenticate with Tinybird**:

   ```bash
   tb login
   ```

3. **Deploy to Tinybird**:
   ```bash
   cd tinybird
   tb deploy
   ```

## Data Sources

- **page_views**: Tracks all page view events with visitor, session, and page details
- **events**: Stores custom events like clicks, form submissions, and conversions
- **sessions**: Maintains session-level data with aggregated metrics

## Endpoints

- **analytics_summary**: Returns overall analytics metrics for a business
- **top_pages**: Lists the most visited pages with view counts
- **real_time_visitors**: Shows active visitors in the last 5 minutes

## Environment Variables

Add these to your `.env.local`:

```env
NEXT_PUBLIC_TINYBIRD_API_URL=https://api.tinybird.co
NEXT_PUBLIC_TINYBIRD_TOKEN=your_token_here
```

## Testing Locally

1. Start Tinybird Local:

   ```bash
   tb local start
   ```

2. Load test data:

   ```bash
   tb datasource append page_views fixtures/page_views.ndjson
   tb datasource append events fixtures/events.ndjson
   tb datasource append sessions fixtures/sessions.ndjson
   ```

3. Test endpoints:
   ```bash
   tb pipe data analytics_summary --param business_id=j57d4m5p6q7r8s9t
   ```

## Integration with Locasite

The integration works in two modes:

1. **Hybrid Mode** (default): Events are sent to both Convex (for real-time features) and Tinybird (for analytics)
2. **Tinybird-only Mode**: Can be enabled by setting environment variables

Analytics data flows:

- Client-side tracking via `Analytics` class sends events to both systems
- Tinybird handles long-term storage and complex analytics queries
- Convex maintains real-time session data and recent activity
