/**
 * IdleCampus Backend API Server
 * Python code execution service with REST API
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { pythonExecutor } from './services/pythonExecutor.js';
import codeLabsRouter from './routes/codeLabs.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', async (req: Request, res: Response) => {
  try {
    const pythonAvailable = await pythonExecutor.checkPythonAvailability();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        python: pythonAvailable ? 'available' : 'unavailable',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// API routes
app.use('/api/v1/code_labs', codeLabsRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// Start server
async function startServer() {
  try {
    // Check Python availability
    const pythonAvailable = await pythonExecutor.checkPythonAvailability();

    if (!pythonAvailable) {
      console.warn('⚠️  Warning: Python is not available. Code execution will fail.');
      console.warn('   Please ensure Python 3 is installed and in PATH.');
    } else {
      console.log('✅ Python is available');
    }

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 IdleCampus Backend API Server                        ║
║                                                            ║
║   Server running at: http://localhost:${PORT}             ║
║   Health check:      http://localhost:${PORT}/health      ║
║   API Base:          http://localhost:${PORT}/api/v1      ║
║                                                            ║
║   Python Status: ${pythonAvailable ? '✅ Available' : '❌ Unavailable'}                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);

      console.log('\n📋 Available Endpoints:');
      console.log('   GET  /health');
      console.log('   GET  /api/v1/code_labs');
      console.log('   GET  /api/v1/code_labs/:id');
      console.log('   POST /api/v1/code_labs/:id/execute');
      console.log('   POST /api/v1/code_labs/:id/validate');
      console.log('   POST /api/v1/code_labs/:id/submit');
      console.log('   GET  /api/v1/code_labs/:id/hint');
      console.log('   GET  /api/v1/code_labs/:id/solution\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();
