/**
 * Database Setup Service
 *
 * Manages PostgreSQL database setup for system design validation
 * - Creates isolated database schemas per session
 * - Executes user's SQL schema
 * - Provides database connection for testing
 */

import { Pool, PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export interface DatabaseConnection {
  sessionId: string;
  schemaName: string;
  pool: Pool;
  client?: PoolClient;
}

export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class DatabaseSetup {
  private masterPool: Pool | null = null;
  private activeSessions: Map<string, DatabaseConnection> = new Map();

  constructor() {
    this.initializeMasterConnection();
  }

  /**
   * Initialize master database connection
   */
  private initializeMasterConnection() {
    // Only initialize if PostgreSQL is available
    const host = process.env.POSTGRES_HOST || 'localhost';
    const port = parseInt(process.env.POSTGRES_PORT || '5432');
    const user = process.env.POSTGRES_USER || 'system_design';
    const password = process.env.POSTGRES_PASSWORD || 'test_password';
    const database = process.env.POSTGRES_DB || 'system_design_test';

    try {
      this.masterPool = new Pool({
        host,
        port,
        user,
        password,
        database,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      console.log('[DatabaseSetup] PostgreSQL connection initialized');
    } catch (error) {
      console.warn('[DatabaseSetup] PostgreSQL not available, running in simulation mode');
      this.masterPool = null;
    }
  }

  /**
   * Check if PostgreSQL is available
   */
  async isAvailable(): Promise<boolean> {
    if (!this.masterPool) return false;

    try {
      const client = await this.masterPool.connect();
      await client.query('SELECT 1');
      client.release();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Create isolated database schema for user session
   */
  async createSession(userSchema: string, problemId: string): Promise<DatabaseConnection> {
    if (!this.masterPool) {
      throw new Error('PostgreSQL not available. Run with docker-compose to enable database validation.');
    }

    const sessionId = uuidv4();
    const schemaName = `session_${sessionId.replace(/-/g, '_')}`;

    console.log(`[DatabaseSetup] Creating session ${sessionId} with schema ${schemaName}`);

    try {
      const client = await this.masterPool.connect();

      // Create isolated schema
      await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

      // Set search path to use this schema
      await client.query(`SET search_path TO ${schemaName}, public`);

      // Execute user's schema SQL
      try {
        await client.query(userSchema);
        console.log(`[DatabaseSetup] Schema created successfully for session ${sessionId}`);
      } catch (schemaError) {
        console.error(`[DatabaseSetup] Schema execution failed:`, schemaError);
        // Clean up on error
        await client.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
        client.release();
        throw new Error(`Schema execution failed: ${schemaError instanceof Error ? schemaError.message : 'Unknown error'}`);
      }

      // Create connection pool for this session
      const sessionPool = new Pool({
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        user: process.env.POSTGRES_USER || 'system_design',
        password: process.env.POSTGRES_PASSWORD || 'test_password',
        database: process.env.POSTGRES_DB || 'system_design_test',
        max: 5,
        options: `-c search_path=${schemaName},public`,
      });

      const connection: DatabaseConnection = {
        sessionId,
        schemaName,
        pool: sessionPool,
        client,
      };

      this.activeSessions.set(sessionId, connection);

      return connection;
    } catch (error) {
      console.error(`[DatabaseSetup] Failed to create session:`, error);
      throw error;
    }
  }

  /**
   * Execute query on user's database
   */
  async executeQuery(sessionId: string, query: string, params: any[] = []): Promise<any> {
    const connection = this.activeSessions.get(sessionId);
    if (!connection) {
      throw new Error(`Session ${sessionId} not found`);
    }

    try {
      const result = await connection.pool.query(query, params);
      return result;
    } catch (error) {
      console.error(`[DatabaseSetup] Query execution failed:`, error);
      throw error;
    }
  }

  /**
   * Clean up session and drop schema
   */
  async destroySession(sessionId: string): Promise<void> {
    const connection = this.activeSessions.get(sessionId);
    if (!connection) {
      console.warn(`[DatabaseSetup] Session ${sessionId} not found for cleanup`);
      return;
    }

    console.log(`[DatabaseSetup] Cleaning up session ${sessionId}`);

    try {
      // Drop schema (cascades to all tables)
      if (connection.client) {
        await connection.client.query(`DROP SCHEMA IF EXISTS ${connection.schemaName} CASCADE`);
        connection.client.release();
      }

      // Close connection pool
      await connection.pool.end();

      // Remove from active sessions
      this.activeSessions.delete(sessionId);

      console.log(`[DatabaseSetup] Session ${sessionId} cleaned up successfully`);
    } catch (error) {
      console.error(`[DatabaseSetup] Failed to cleanup session ${sessionId}:`, error);
    }
  }

  /**
   * Validate user's schema (text analysis)
   */
  validateSchemaSQL(schema: string, requiredTables: string[]): SchemaValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const schemaLower = schema.toLowerCase();

    // Check for required tables
    for (const table of requiredTables) {
      const tableLower = table.toLowerCase();
      if (!schemaLower.includes(`create table ${tableLower}`) &&
          !schemaLower.includes(`create table if not exists ${tableLower}`)) {
        errors.push(`Missing required table: ${table}`);
      }
    }

    // Check for primary keys
    if (!schemaLower.includes('primary key') && !schemaLower.includes('primary key')) {
      warnings.push('No PRIMARY KEY defined. Consider adding for better performance.');
    }

    // Check for indexes (recommended for read-heavy workloads)
    if (!schemaLower.includes('create index') && !schemaLower.includes('index')) {
      warnings.push('No indexes defined. Consider adding for better query performance.');
    }

    // Check for potential issues
    if (schemaLower.includes('text') && !schemaLower.includes('not null')) {
      warnings.push('TEXT columns without NOT NULL constraint may allow unexpected nulls.');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Clean up all active sessions (on shutdown)
   */
  async cleanup(): Promise<void> {
    console.log(`[DatabaseSetup] Cleaning up ${this.activeSessions.size} active sessions`);

    for (const sessionId of this.activeSessions.keys()) {
      await this.destroySession(sessionId);
    }

    if (this.masterPool) {
      await this.masterPool.end();
      console.log('[DatabaseSetup] Master pool closed');
    }
  }

  /**
   * Get list of tables in user's schema
   */
  async getTableList(sessionId: string): Promise<string[]> {
    const connection = this.activeSessions.get(sessionId);
    if (!connection) {
      throw new Error(`Session ${sessionId} not found`);
    }

    try {
      const result = await connection.pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = $1
        ORDER BY table_name
      `, [connection.schemaName]);

      return result.rows.map(row => row.table_name);
    } catch (error) {
      console.error(`[DatabaseSetup] Failed to get table list:`, error);
      return [];
    }
  }
}

// Export singleton instance
export const databaseSetup = new DatabaseSetup();

// Cleanup on process exit
process.on('SIGINT', async () => {
  await databaseSetup.cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await databaseSetup.cleanup();
  process.exit(0);
});
