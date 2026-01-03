# CORS Error Explanation and Solutions

## Understanding the Error

The error you're seeing has **two root causes**:

### 1. **Route Not Found (Primary Issue)**
```
GET http://localhost:3000/api/v1/kubernetes/courses
→ Redirected to: http://localhost:3000/
```

**What this means:**
- Your Rails backend doesn't have the route `/api/v1/kubernetes/courses` configured
- Rails is redirecting the request to the root path `/`
- This is a **routing issue**, not just a CORS issue

### 2. **Missing CORS Headers (Secondary Issue)**
```
Access to fetch at 'http://localhost:3000/' (redirected from 'http://localhost:3000/api/v1/kubernetes/courses') 
from origin 'http://localhost:5173' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present
```

**What this means:**
- Your frontend (`http://localhost:5173`) is making a cross-origin request to Rails (`http://localhost:3000`)
- The Rails backend isn't sending CORS headers in its responses
- Even if the route existed, you'd still get a CORS error

## Why This Happens

1. **Frontend Code** (`src/services/api.ts`):
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
   // When VITE_API_URL is not set, this becomes '/api/v1' (relative)
   // Which resolves to: http://localhost:5173/api/v1
   ```

2. **If VITE_API_URL is set to `http://localhost:3000/api/v1`**:
   - Frontend makes request to: `http://localhost:3000/api/v1/kubernetes/courses`
   - Rails doesn't have this route → redirects to `/`
   - Redirect response has no CORS headers → browser blocks it

## Solutions

### Solution 1: Configure Vite Proxy (Recommended for Development)

Create or update `vite.config.ts` to proxy API requests:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

**Benefits:**
- Frontend uses relative URLs (`/api/v1/...`)
- Vite proxies requests to Rails backend
- No CORS issues (same origin from browser's perspective)
- No need to set `VITE_API_URL`

### Solution 2: Fix Rails Backend Routes

Ensure your Rails backend has the correct routes configured:

**In `config/routes.rb`:**
```ruby
namespace :api do
  namespace :v1 do
    resources :kubernetes, only: [] do
      resources :courses, only: [:index, :show]
      resources :labs, only: [:index, :show]
    end
    
    # Or use a more flexible approach:
    get ':track/courses', to: 'courses#index'
    get ':track/courses/:slug', to: 'courses#show'
    get ':track/courses/:course_slug/modules', to: 'modules#index'
    get ':track/courses/:course_slug/modules/:module_slug', to: 'modules#show'
    get ':track/labs', to: 'labs#index'
    get ':track/labs/:id', to: 'labs#show'
  end
end
```

### Solution 3: Configure CORS in Rails

Install and configure the `rack-cors` gem:

**In `Gemfile`:**
```ruby
gem 'rack-cors'
```

**In `config/initializers/cors.rb`:**
```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:5173', 'http://localhost:5000'
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
```

**In `config/application.rb`:**
```ruby
config.middleware.use Rack::Cors
```

### Solution 4: Set Environment Variable

Create a `.env` file in the frontend directory:

```bash
VITE_API_URL=http://localhost:3000/api/v1
```

**Note:** This will cause CORS issues unless Rails has CORS configured (Solution 3).

## Recommended Approach

**For Development:**
1. ✅ Use **Solution 1** (Vite proxy) - easiest and no CORS needed
2. ✅ Ensure **Solution 2** (Rails routes) - fix the routing issue
3. ⚠️ Optionally add **Solution 3** (CORS) - needed if using absolute URLs

**For Production:**
1. ✅ Use **Solution 3** (CORS) - configure proper CORS headers
2. ✅ Use environment variables for API URL
3. ✅ Ensure Rails routes are correct

## Quick Fix Checklist

- [ ] Check if `vite.config.ts` exists and has proxy configuration
- [ ] Verify Rails routes include `/api/v1/:track/courses`
- [ ] Check if `rack-cors` gem is installed in Rails
- [ ] Verify CORS initializer exists in Rails
- [ ] Test the Rails endpoint directly: `curl http://localhost:3000/api/v1/kubernetes/courses`
- [ ] Check Rails logs for routing errors

## Testing

After implementing fixes, test:

1. **Direct Rails endpoint:**
   ```bash
   curl http://localhost:3000/api/v1/kubernetes/courses
   ```

2. **Check CORS headers:**
   ```bash
   curl -H "Origin: http://localhost:5173" \
        -H "Access-Control-Request-Method: GET" \
        -X OPTIONS \
        http://localhost:3000/api/v1/kubernetes/courses \
        -v
   ```

3. **Frontend should now work** without CORS errors

## Additional Notes

- The redirect from `/api/v1/kubernetes/courses` to `/` suggests Rails routing is catching the request but doesn't have a matching route
- Check `rails routes` command to see all available routes
- Rails may be redirecting due to missing route or authentication middleware

