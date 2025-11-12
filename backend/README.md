# IdleCampus Backend API

Python code execution service with REST API for the IdleCampus learning platform.

## Features

- **Secure Python Code Execution**: Run Python code in a sandboxed environment with timeouts and resource limits
- **Test Validation**: Automatically validate code against test cases
- **Challenge Management**: Load and manage coding challenges
- **RESTful API**: Standard REST endpoints for code execution, validation, and submission
- **Docker Support**: Containerized deployment for production

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Vite)                       │
│                  http://localhost:5173                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ HTTP/REST
                 ▼
┌─────────────────────────────────────────────────────────┐
│                 Backend API (Express)                    │
│                  http://localhost:3001                   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │  API Routes                                       │  │
│  │  • POST /api/v1/code_labs/:id/execute           │  │
│  │  • POST /api/v1/code_labs/:id/validate          │  │
│  │  • POST /api/v1/code_labs/:id/submit            │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                    │
│                     ▼                                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Python Executor Service                         │  │
│  │  • Spawn Python subprocess                       │  │
│  │  • Apply timeout & memory limits                 │  │
│  │  • Capture stdout/stderr                         │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                    │
│                     ▼                                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Test Runner                                     │  │
│  │  • Load test cases                               │  │
│  │  • Execute tests                                 │  │
│  │  • Compare results                               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

- **Node.js**: v20 or higher
- **Python**: v3.8 or higher
- **npm**: v9 or higher
- **Docker** (optional): For containerized deployment

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:3001`

3. **Verify Python is available:**
   ```bash
   curl http://localhost:3001/health
   ```

   Expected response:
   ```json
   {
     "status": "healthy",
     "timestamp": "2024-01-15T10:30:00.000Z",
     "services": {
       "python": "available"
     }
   }
   ```

### Docker Deployment

1. **Build the Docker image:**
   ```bash
   docker build -t idlecampus-backend .
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f backend
   ```

4. **Stop the service:**
   ```bash
   docker-compose down
   ```

## API Endpoints

### Health Check

```bash
GET /health
```

Check server and Python availability.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "python": "available"
  }
}
```

### List Challenges

```bash
GET /api/v1/code_labs
```

Get all available code lab challenges.

**Response:**
```json
{
  "success": true,
  "challenges": [
    {
      "id": "tinyurl_hash_function",
      "title": "Implement Base62 Encoding",
      "description": "Design a function to convert a numeric ID...",
      "difficulty": "easy"
    }
  ]
}
```

### Get Challenge Details

```bash
GET /api/v1/code_labs/:id
```

Get full challenge details including starter code.

**Response:**
```json
{
  "success": true,
  "challenge": {
    "id": "tinyurl_hash_function",
    "title": "Implement Base62 Encoding",
    "description": "...",
    "difficulty": "easy",
    "starter_code": "def generate_short_code(id: int) -> str:\n    ...",
    "time_limit": 5,
    "memory_limit": 128
  }
}
```

### Execute Code

```bash
POST /api/v1/code_labs/:id/execute
Content-Type: application/json

{
  "code": "print('Hello, World!')",
  "testInput": "",
  "timeout": 5
}
```

Execute Python code and return output.

**Response:**
```json
{
  "success": true,
  "output": "Hello, World!",
  "error": null,
  "execution_time": 0.123,
  "memory_used": 10.5
}
```

### Validate Code

```bash
POST /api/v1/code_labs/:id/validate
Content-Type: application/json

{
  "code": "def generate_short_code(id: int) -> str:\n    return 'abc'"
}
```

Run all test cases and return validation results.

**Response:**
```json
{
  "success": false,
  "output": "2 out of 4 tests failed...",
  "execution_time": 0.456,
  "validation": {
    "success": false,
    "passed": 2,
    "failed": 2,
    "total": 4,
    "test_results": [
      {
        "name": "ID = 0",
        "passed": true,
        "input": [0],
        "expected": "a",
        "actual": "a",
        "execution_time": 0.1
      },
      {
        "name": "Small ID",
        "passed": false,
        "input": [62],
        "expected": "ba",
        "actual": "abc",
        "error": "Output does not match expected result",
        "execution_time": 0.1
      }
    ]
  }
}
```

### Submit Code

```bash
POST /api/v1/code_labs/:id/submit
Content-Type: application/json

{
  "code": "def generate_short_code(id: int) -> str:\n    ..."
}
```

Submit code for final grading.

**Response:**
```json
{
  "success": true,
  "output": "Excellent! All test cases passed.",
  "execution_time": 0.456,
  "validation": { ... },
  "score": 100,
  "feedback": "Excellent! All test cases passed. Your solution is correct."
}
```

### Get Hint

```bash
GET /api/v1/code_labs/:id/hint
```

Get hints for a challenge.

**Response:**
```json
{
  "success": true,
  "hints": [
    "Use modulo (%) operation to get the remainder when dividing by 62",
    "Build the result string from right to left",
    "Use floor division (//) to get the quotient"
  ]
}
```

### Get Solution

```bash
GET /api/v1/code_labs/:id/solution
```

Get the reference solution for a challenge.

**Response:**
```json
{
  "success": true,
  "solution": "def generate_short_code(id: int) -> str:\n    ..."
}
```

## Security Features

### Code Execution Security

1. **Timeout Limits**: All executions have a maximum timeout (default 5s, max 30s)
2. **Memory Limits**: Configurable memory limits per challenge
3. **Output Size Limits**: Prevents memory exhaustion from large outputs
4. **Process Isolation**: Each execution runs in a separate subprocess
5. **Resource Limits** (Linux): Uses `ulimit` to restrict CPU and memory
6. **File System Isolation**: Temporary files are created in isolated directory
7. **No Network Access**: Executed code cannot make network requests

### API Security

- **Input Validation**: All inputs are validated before execution
- **Error Handling**: Comprehensive error handling prevents information leakage
- **CORS**: Configurable CORS settings for frontend integration
- **Rate Limiting**: (TODO) Implement rate limiting for production

## Available Challenges

### 1. Base62 Encoding (Easy)
- **ID**: `tinyurl_hash_function`
- **Description**: Convert numeric ID to Base62 string
- **Test Cases**: 4
- **Time Limit**: 5 seconds

### 2. Token Bucket Rate Limiter (Medium)
- **ID**: `tinyurl_rate_limiter`
- **Description**: Implement token bucket rate limiting
- **Test Cases**: 3
- **Time Limit**: 5 seconds

### 3. Collision Handling (Hard)
- **ID**: `tinyurl_collision_handling`
- **Description**: Handle hash collisions efficiently
- **Test Cases**: 2
- **Time Limit**: 5 seconds

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Express server entry point
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── routes/
│   │   └── codeLabs.ts       # API route handlers
│   ├── services/
│   │   ├── pythonExecutor.ts # Python code execution
│   │   ├── testRunner.ts     # Test validation
│   │   └── challengeLoader.ts# Challenge definitions
│   └── middleware/
│       └── auth.ts           # Authentication (TODO)
├── temp/                     # Temporary code execution files
├── challenges/               # Challenge definitions
├── package.json
├── tsconfig.json
├── Dockerfile
└── docker-compose.yml
```

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

### Starting Production Server

```bash
npm start
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Python Configuration (optional)
PYTHON_PATH=/usr/bin/python3
```

## Troubleshooting

### Python Not Available

**Error:**
```
⚠️  Warning: Python is not available. Code execution will fail.
```

**Solution:**
1. Install Python 3: `apt-get install python3` or `brew install python3`
2. Verify Python is in PATH: `which python3`
3. Set `PYTHON_PATH` environment variable if needed

### Permission Denied on temp/ Directory

**Error:**
```
EACCES: permission denied, open '/app/temp/xxx.py'
```

**Solution:**
```bash
chmod 777 temp/
```

### Docker Container Fails to Start

**Check logs:**
```bash
docker-compose logs backend
```

**Common issues:**
- Port 3001 already in use
- Python not available in container
- Insufficient memory

### High Memory Usage

**Solution:**
- Reduce `memory_limit` in challenge definitions
- Implement cleanup for stale temp files
- Monitor with `docker stats`

## Performance Considerations

### Code Execution Performance

- **Cold Start**: First execution ~100ms
- **Warm Start**: Subsequent executions ~50ms
- **Throughput**: ~20 executions/second (single core)

### Scaling

For production with high traffic:

1. **Horizontal Scaling**: Run multiple backend instances behind load balancer
2. **Queue System**: Use Redis + Bull for job queue
3. **Resource Isolation**: Use Docker with resource limits
4. **Caching**: Cache challenge definitions and test cases

## Future Enhancements

- [ ] Add more programming languages (JavaScript, Java, C++)
- [ ] Implement authentication and user sessions
- [ ] Add rate limiting per user/IP
- [ ] Store submission history in database
- [ ] Add real-time code execution progress
- [ ] Implement code analysis and hints system
- [ ] Add performance profiling for submissions
- [ ] Support custom test cases

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT

## Support

For issues or questions:
- GitHub Issues: [Report an issue](https://github.com/your-repo/issues)
- Documentation: [Full docs](https://docs.idlecampus.com)
