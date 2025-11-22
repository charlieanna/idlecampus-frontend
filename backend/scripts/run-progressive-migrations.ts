/**
 * Progressive Flow Migration Runner
 * 
 * Runs PostgreSQL migrations for the Progressive Flow system
 * - Tracks which migrations have been applied
 * - Supports rollback
 * - Can run migrations in order
 */

import { Pool, PoolClient } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

interface MigrationRecord {
  id: number;
  name: string;
  applied_at: Date;
}

class MigrationRunner {
  private pool: Pool;
  private migrationsDir: string;

  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      user: process.env.POSTGRES_USER || 'system_design',
      password: process.env.POSTGRES_PASSWORD || 'test_password',
      database: process.env.POSTGRES_DB || 'system_design_test',
    });

    this.migrationsDir = path.join(__dirname, '../migrations/progressive-flow');
  }

  /**
   * Create migrations tracking table
   */
  async createMigrationsTable(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS progressive_flow_migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          applied_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('✓ Migrations tracking table ready');
    } finally {
      client.release();
    }
  }

  /**
   * Get list of applied migrations
   */
  async getAppliedMigrations(): Promise<string[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query<MigrationRecord>(
        'SELECT name FROM progressive_flow_migrations ORDER BY id'
      );
      return result.rows.map(row => row.name);
    } finally {
      client.release();
    }
  }

  /**
   * Get list of pending migrations
   */
  async getPendingMigrations(): Promise<string[]> {
    const allMigrations = this.getAllMigrationFiles();
    const appliedMigrations = await this.getAppliedMigrations();
    
    return allMigrations.filter(migration => !appliedMigrations.includes(migration));
  }

  /**
   * Get all migration files from directory
   */
  getAllMigrationFiles(): string[] {
    if (!fs.existsSync(this.migrationsDir)) {
      throw new Error(`Migrations directory not found: ${this.migrationsDir}`);
    }

    return fs.readdirSync(this.migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
  }

  /**
   * Run a single migration
   */
  async runMigration(migrationName: string, client: PoolClient): Promise<void> {
    const migrationPath = path.join(this.migrationsDir, migrationName);
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    console.log(`Running migration: ${migrationName}`);

    try {
      // Execute migration SQL
      await client.query(sql);

      // Record migration
      await client.query(
        'INSERT INTO progressive_flow_migrations (name) VALUES ($1)',
        [migrationName]
      );

      console.log(`✓ Migration completed: ${migrationName}`);
    } catch (error) {
      console.error(`✗ Migration failed: ${migrationName}`);
      throw error;
    }
  }

  /**
   * Run all pending migrations
   */
  async runPendingMigrations(): Promise<void> {
    const pendingMigrations = await this.getPendingMigrations();

    if (pendingMigrations.length === 0) {
      console.log('✓ No pending migrations');
      return;
    }

    console.log(`Found ${pendingMigrations.length} pending migration(s)`);

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      for (const migration of pendingMigrations) {
        await this.runMigration(migration, client);
      }

      await client.query('COMMIT');
      console.log('\n✓ All migrations completed successfully');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('\n✗ Migration failed, rolling back');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Rollback last migration
   */
  async rollbackLastMigration(): Promise<void> {
    const appliedMigrations = await this.getAppliedMigrations();

    if (appliedMigrations.length === 0) {
      console.log('No migrations to rollback');
      return;
    }

    const lastMigration = appliedMigrations[appliedMigrations.length - 1];
    console.log(`Rolling back migration: ${lastMigration}`);

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Read rollback section from migration file
      const migrationPath = path.join(this.migrationsDir, lastMigration);
      const sql = fs.readFileSync(migrationPath, 'utf-8');
      
      // Extract rollback commands (comments starting with -- To rollback)
      const rollbackMatch = sql.match(/-- To rollback this migration, run:([\s\S]*?)(?:--|$)/);
      
      if (!rollbackMatch) {
        throw new Error('No rollback instructions found in migration file');
      }

      const rollbackSQL = rollbackMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('--'))
        .map(line => line.replace(/^--\s*/, ''))
        .join('\n');

      // Execute rollback
      await client.query(rollbackSQL);

      // Remove migration record
      await client.query(
        'DELETE FROM progressive_flow_migrations WHERE name = $1',
        [lastMigration]
      );

      await client.query('COMMIT');
      console.log(`✓ Rolled back migration: ${lastMigration}`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('✗ Rollback failed');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Show migration status
   */
  async showStatus(): Promise<void> {
    const allMigrations = this.getAllMigrationFiles();
    const appliedMigrations = await this.getAppliedMigrations();

    console.log('\n=== Migration Status ===\n');

    allMigrations.forEach(migration => {
      const isApplied = appliedMigrations.includes(migration);
      const status = isApplied ? '✓' : '✗';
      console.log(`${status} ${migration}`);
    });

    console.log(`\nTotal: ${allMigrations.length} migrations`);
    console.log(`Applied: ${appliedMigrations.length}`);
    console.log(`Pending: ${allMigrations.length - appliedMigrations.length}`);
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    await this.pool.end();
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'migrate';

  const runner = new MigrationRunner();

  try {
    // Create migrations table
    await runner.createMigrationsTable();

    switch (command) {
      case 'migrate':
        await runner.runPendingMigrations();
        break;

      case 'rollback':
        await runner.rollbackLastMigration();
        break;

      case 'status':
        await runner.showStatus();
        break;

      default:
        console.log('Usage:');
        console.log('  npm run migrate:progressive       - Run pending migrations');
        console.log('  npm run migrate:progressive rollback - Rollback last migration');
        console.log('  npm run migrate:progressive status   - Show migration status');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await runner.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { MigrationRunner };