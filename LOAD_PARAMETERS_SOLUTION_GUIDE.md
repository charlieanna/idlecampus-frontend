# Load Parameters Problem - Solution Guide

## What You Need to Build

This problem requires you to manually build a solution in the UI. Here's exactly what you need:

### Required Components:

1. **Client** (type: `client`)
   - This is usually already on the canvas
   - If not, drag "Client" from the component palette

2. **App Server** (type: `app_server`)
   - Drag "App Server" from the component palette
   - **Configure**: Set instances to at least 2-3 for 1000 RPS
   - This handles metric collection and dashboard serving

3. **Redis Cache** (type: `redis`)
   - Drag "Redis" from the component palette
   - **Configure**: 
     - Memory: 4-8 GB
     - Hit Ratio: 0.8 (80%)
   - This caches recent metrics for fast dashboard loading

4. **PostgreSQL Database** (type: `postgresql`)
   - Drag "PostgreSQL" from the component palette
   - **Configure**:
     - Read Capacity: 1000+ RPS
     - Write Capacity: 100+ RPS
   - This stores historical metrics data

### Required Connections:

Connect components in this order:

1. **Client → App Server**
   - Engineers access dashboards through app servers

2. **App Server → Redis**
   - App servers check cache for recent metrics before querying database

3. **App Server → Database**
   - App servers store collected metrics in database

4. **Redis → Database**
   - Cache misses query database for historical data

### Visual Layout:

```
Client
  ↓
App Server (2-3 instances)
  ↓        ↓
Redis    Database
  ↓
Database
```

## Why Tests Might Fail

### Architecture Failures (Check Architecture Feedback Panel):

- ❌ **Missing component**: "Missing cache: Cache recent metrics for fast dashboard loading"
  - **Fix**: Add Redis component

- ❌ **Missing connection**: "Need connection: compute → cache"
  - **Fix**: Connect App Server → Redis

- ❌ **Wrong connection**: "Client should not connect directly to database"
  - **Fix**: Remove direct Client → Database connection

### Performance Failures:

The FR tests require **0% error rate** - this is very strict! Your system must handle traffic perfectly.

Common issues:
- **Not enough app server instances**: Add more instances (try 3-5)
- **Database capacity too low**: Increase read/write capacity
- **No caching**: Redis must be properly configured and connected
- **Latency too high**: Add more app servers or increase database capacity

## Step-by-Step Solution:

1. **Add Components**:
   - Client (if not already there)
   - App Server (configure: 3 instances)
   - Redis (configure: 4GB memory, 0.8 hit ratio)
   - PostgreSQL (configure: 1000 read, 100 write capacity)

2. **Add Connections**:
   - Client → App Server
   - App Server → Redis
   - App Server → Database
   - Redis → Database

3. **Run Tests**:
   - Click "Run Tests"
   - Check "Architecture Feedback" panel for missing components/connections
   - Check individual test results for performance issues

4. **If Tests Still Fail**:
   - **Architecture errors**: Fix missing components/connections first
   - **Performance errors**: Increase capacity (more app servers, higher database capacity)
   - **Error rate > 0%**: This means your system can't handle the traffic - add more capacity

## Expected Test Results:

- **FR Tests (6 tests)**: Should pass if architecture is correct and system can handle low traffic (10-100 RPS) with 0% errors
- **NFR Tests (~16 tests)**: Should pass if system can handle 1000+ RPS with acceptable latency

## Debugging Tips:

1. **Check Architecture Feedback First**: This tells you exactly what's missing
2. **Check Test Details**: Click on a failed test to see:
   - Actual latency vs target
   - Actual error rate vs target (0% for FR tests!)
   - Actual cost vs budget
3. **Start Simple**: Get architecture right first (all components and connections), then optimize performance

## Common Mistakes:

- ❌ Forgetting to add Redis cache
- ❌ Not connecting Redis properly (must be: App Server → Redis → Database)
- ❌ Not configuring enough app server instances
- ❌ Database capacity too low for the traffic
- ❌ Missing Client → App Server connection

