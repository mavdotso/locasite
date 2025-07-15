# Tinybird Analytics Integration Guide

## Overview

Locasite now supports Tinybird for scalable analytics data storage and querying. The integration works in a hybrid mode where:

- Events are sent to both Convex (for real-time features) and Tinybird (for analytics)
- The analytics dashboard can switch between data sources
- Tinybird handles long-term storage and complex analytics queries

## Current Status

✅ **Tinybird is now deployed and ready to use!**

- All data sources and endpoints are deployed to Tinybird Cloud
- Test data has been loaded for development
- The analytics dashboard has been updated to support Tinybird
- API endpoints are available:
  - `api_analytics_summary` - Overall analytics metrics
  - `api_top_pages` - Top pages by view count
  - `api_real_time_visitors` - Active visitors in last 5 minutes

## Setup Instructions

### 1. Create a Tinybird Account

1. Sign up at [tinybird.co](https://www.tinybird.co)
2. Create a new workspace for your project

### 2. Deploy Tinybird Resources

```bash
# Navigate to the Tinybird directory
cd tinybird

# Authenticate with Tinybird
tb login

# Deploy data sources and pipes to cloud
tb --cloud deploy

# Load test data (optional)
tb --cloud datasource append page_views fixtures/page_views.ndjson
tb --cloud datasource append events fixtures/events.ndjson
tb --cloud datasource append sessions fixtures/sessions.ndjson
```

### 3. Configure Environment Variables

Add these to your `.env.local`:

```env
NEXT_PUBLIC_TINYBIRD_API_URL=https://api.tinybird.co
NEXT_PUBLIC_TINYBIRD_TOKEN=your_token_here
```

To get your token:

1. Go to the Tinybird UI (run `tb --cloud open`)
2. Navigate to "Tokens" section
3. Create a new token with read permissions for endpoints
4. Copy the token value

### 4. Enable Tinybird Analytics

The analytics dashboard now automatically uses Tinybird when the environment variables are configured. The dashboard includes a toggle to switch between Convex and Tinybird data sources.

### 5. Test the Integration

1. Start your development server:

   ```bash
   bun dev
   ```

2. Visit a published business site to generate page views

3. Go to the analytics dashboard at `/dashboard/business/[businessId]/analytics`

4. Use the data source toggle to switch between Convex and Tinybird

## Architecture

### Data Flow

1. **Client-side tracking**: The `Analytics` class in `/app/lib/analytics.ts` sends events to both systems
2. **Event types**:

   - Page views with visitor, session, and technical details
   - Custom events (clicks, form submissions, conversions)
   - Session data with aggregated metrics

3. **Data sources in Tinybird**:
   - `page_views`: All page view events
   - `events`: Custom tracked events
   - `sessions`: Session-level aggregated data

### Querying Data

The application provides two ways to query analytics:

1. **Convex queries**: Real-time data for recent activity
2. **Tinybird endpoints**: Scalable queries for historical data

### Dashboard Integration

The new analytics dashboard component (`analytics-dashboard-tinybird.tsx`) allows switching between data sources:

- Use Convex for real-time features
- Use Tinybird for historical analytics and better performance at scale

## Benefits

1. **Scalability**: Tinybird handles millions of events efficiently
2. **Performance**: Fast queries even with large datasets
3. **Cost-effective**: Only pay for what you use
4. **Real-time**: Sub-second query response times
5. **SQL-based**: Familiar query language for analytics

## Monitoring

Monitor your Tinybird usage:

1. Check the Tinybird UI for data ingestion stats
2. Monitor API endpoint performance
3. Set up alerts for anomalies

## Troubleshooting

### Events not appearing in Tinybird

1. Check environment variables are set correctly
2. Verify Tinybird token has write permissions
3. Check browser console for errors
4. Use Tinybird UI to inspect data sources

### Query errors

1. Verify endpoint names match between code and Tinybird
2. Check parameter types in pipe definitions
3. Review Tinybird logs for detailed errors

## Future Enhancements

1. **Batch ingestion**: Implement server-side batch processing for better efficiency
2. **Advanced analytics**: Add more complex queries (cohorts, funnels, retention)
3. **Data enrichment**: Add geographic and device data enrichment
4. **Webhooks**: Set up Tinybird webhooks for real-time alerts
5. **Data exports**: Enable CSV/JSON exports from Tinybird
