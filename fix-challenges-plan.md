# Plan to Fix Failing Challenges

## 1. active_active_regions Issue
**Problem**: Connection references component by ID instead of type
- Line 625: `from: "message_queue", to: "conflict_resolver"`  
- But conflict_resolver is an app_server with ID "conflict_resolver"
- Validation script maps by type, not ID

**Solution**: Change the connection to reference by type
- Since there are 2 app_server components, we need a different approach
- Option 1: Change connection to use "app_server" (but ambiguous with 2 app_servers)
- Option 2: Add a separate component type for conflict resolver
- **Best**: Fix the validation script to handle ID-based references for components with custom IDs

## 2. tiny_url_l6 Issue  
**Problem**: Single load balancer can't handle 110,000 RPS
- Test "L6-SCALE-2: Super Bowl Ad (10x spike)" sends 110,000 RPS
- Single load balancer hits 110% utilization → 30% error rate
- L6 tests are intentionally extreme

**Solution**: Scale the load balancer
- Option 1: Add multiple load balancers (2-3 instances)
- Option 2: Increase load balancer capacity/config
- Option 3: Adjust test to be more reasonable (but L6 is meant to be hard)
- **Best**: Configure load balancer with higher capacity or multiple instances

## Implementation Steps

### Fix 1: active_active_regions
Change line 624-627 from:
```typescript
{
  from: "message_queue",
  to: "conflict_resolver",  // This references an ID, not a type
  type: "read",
  label: "Conflict Resolver → Stream"
}
```

To reference the second app_server:
```typescript
{
  from: "message_queue", 
  to: "app_server",  // Reference by type
  type: "read",
  label: "Conflict Resolver → Stream"
}
```

But this is ambiguous with 2 app_servers. Better solution: Add conflict_resolver as a proper component type or fix validation script.

### Fix 2: tiny_url_l6
Update load balancer configuration to handle extreme scale:
```typescript
{
  type: "load_balancer",
  config: {
    algorithm: "least_connections",
    instances: 3,  // Add multiple LB instances
    capacity: 50000,  // Each can handle 50K RPS
    // OR use a global load balancer config
    globalLoadBalancing: true,
    autoScaling: {
      enabled: true,
      targetUtilization: 0.7,
      maxInstances: 5
    }
  }
}
```

## Decision
Since these are generated files, we should fix the generation logic in problemDefinitionConverter.ts rather than manually editing files.