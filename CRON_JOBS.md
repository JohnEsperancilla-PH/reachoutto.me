# Cron Jobs Documentation

This document describes the automated cron jobs configured for the reachoutto.me application.

## Overview

The application uses Vercel Cron Jobs to perform automated maintenance tasks that keep the Supabase database active and healthy.

## Cron Jobs

### 1. Keep-Alive Job (`/api/cron/keep-alive`)

**Schedule:** Daily at 12:00 PM UTC (`0 12 * * *`)

**Purpose:** Prevents Supabase database from going to sleep due to inactivity.

**What it does:**
- Counts total users in the database
- Counts total links in the database  
- Retrieves the most recent user
- Logs database statistics
- Returns health status

**Response Example:**
```json
{
  "success": true,
  "message": "Database keep-alive successful",
  "stats": {
    "timestamp": "2024-01-15T12:00:00.000Z",
    "userCount": 150,
    "linkCount": 1250,
    "recentUser": "johndoe",
    "status": "healthy"
  }
}
```

### 2. Database Cleanup Job (`/api/cron/cleanup`)

**Schedule:** Weekly on Sundays at 2:00 AM UTC (`0 2 * * 0`)

**Purpose:** Performs database maintenance and cleanup tasks.

**What it does:**
- Removes orphaned links (links without valid users)
- Updates link positions for consistency
- Logs database statistics
- Reports maintenance actions taken

**Response Example:**
```json
{
  "success": true,
  "message": "Database cleanup completed",
  "results": {
    "timestamp": "2024-01-15T02:00:00.000Z",
    "tasks": [
      "No orphaned links found",
      "Updated link positions for 25 users",
      "Database stats: 150 users, 1250 links"
    ]
  }
}
```

## Security

Both cron jobs support optional authentication using the `CRON_SECRET` environment variable:

1. Set `CRON_SECRET` in your Vercel environment variables
2. The cron job will verify the `Authorization: Bearer <CRON_SECRET>` header
3. If no secret is set, the endpoints are publicly accessible (but only perform read operations)

## Monitoring

- All cron job executions are logged to the Vercel Functions logs
- Failed executions will return appropriate HTTP error codes
- Success/failure status is included in the JSON response

## Manual Execution

You can manually trigger these endpoints for testing:

```bash
# Keep-alive
curl https://your-domain.com/api/cron/keep-alive

# Cleanup  
curl https://your-domain.com/api/cron/cleanup
```

## Environment Variables

Optional environment variables:

- `CRON_SECRET`: Secret token for authenticating cron job requests
- Standard Supabase environment variables are required for database access

## Benefits

1. **Database Persistence:** Keeps Supabase free tier active
2. **Data Integrity:** Maintains clean, consistent database state
3. **Performance:** Optimizes link ordering and removes orphaned data
4. **Monitoring:** Provides insights into database growth and health
