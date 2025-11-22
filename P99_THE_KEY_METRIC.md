# Why P99 is THE Metric for System Design

## The P50 Trap
P50 (median latency) is **misleading**:
- 50% of your users have WORSE experience than P50
- P50 hides the tail latency that ruins user experience
- A great P50 with terrible P99 = unhappy users

## Why P99 Matters

### 1. **P99 Defines Your SLA**
```
If P99 = 200ms, then:
- 99% of requests complete in ≤200ms
- 1% of requests (the unlucky ones) take longer
- Your SLA promise: "99% of requests under 200ms"
```

### 2. **Real User Impact**
For 1M requests/day:
- P99 issues affect 10,000 requests
- That's 10,000 frustrated users
- These users often generate the most complaints

### 3. **What SREs Actually Monitor**
```yaml
alerts:
  - name: "High P99 Latency"
    condition: p99_latency > 500ms
    severity: PAGE

  # Nobody pages for P50!
  - name: "P50 Latency"
    condition: p50_latency > 200ms
    severity: INFO  # Just a note, not urgent
```

## L6 System Design: P99 Targets

### Typical P99 Requirements:
- **User-facing API**: < 100ms P99
- **Search**: < 200ms P99
- **Media streaming**: < 50ms P99 (first byte)
- **Database query**: < 10ms P99

### How L6 Engineers Achieve Low P99:

1. **99.95% Cache Hit Ratio**
   - Cache hits: ~10ms P99
   - Cache misses: ~100ms P99
   - With 99.95% hits: P99 ≈ 10ms

2. **Request Hedging**
   - Send duplicate requests to multiple servers
   - Use whichever responds first
   - Dramatically reduces P99

3. **Circuit Breakers**
   - Fail fast instead of timing out
   - Prevents cascade failures
   - Keeps P99 predictable

4. **Load Shedding**
   - Drop low-priority requests under load
   - Protect P99 for critical requests
   - Better to serve 99% well than 100% poorly

## Interview Pro Tips

### Always Discuss P99, Not P50
❌ "Our system has 50ms median latency"
✅ "Our system achieves 100ms P99 latency"

### Design for P99 from Day 1
- Size caches for P99 working set
- Plan capacity for P99 load
- Set timeouts based on P99 expectations

### The P99 Formula for L6 Scale
```
P99 = CacheHitRatio × CacheP99 + (1 - CacheHitRatio) × BackendP99

Example:
- 99.95% cache hits at 10ms P99
- 0.05% backend calls at 200ms P99
- Overall P99 ≈ 10ms (cache dominates)
```

## Current System Performance

With our L6 optimizations:
- **99.2% test pass rate** (1252/1262 tests)
- **P99 = P50 × 1.2** for L6-scale systems
- Realistic variance that reflects production systems
- Students learn what actually matters for interviews

## Remember:
**In production, nobody cares about P50. P99 is what keeps the site up and users happy.**