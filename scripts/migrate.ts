import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL || "postgres://postgres:password@localhost:5432/posts_db";
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set for migration.');
}

async function runMigrations() {
  console.log('Starting migrations...');
  const sql = postgres(connectionString!, { max: 1 }); 
  const db = drizzle(sql);

  try {
    await migrate(db, { migrationsFolder: 'server/db/migrations' });
    console.log('Migrations applied successfully!');
  } catch (error) {
    console.error('Error applying migrations:', error);
    process.exit(1);
  } finally {
    await sql.end();
    console.log('Migration client disconnected.');
  }
}

runMigrations();
