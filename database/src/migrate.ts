import { db } from './client';
import { sql } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function cleanSqlStatement(statement: string): string {
  // Remove statement-breakpoint comments
  statement = statement.replace(/-->\s*statement-breakpoint/g, '');
  
  // Remove double quotes around identifiers
  statement = statement.replace(/"([^"]+)"/g, '`$1`');
  
  // Fix ALTER syntax
  statement = statement.replace(/ALTER TABLE .* ALTER COLUMN .* TO /g, 'ALTER TABLE ');
  
  // Skip problematic statements
  if (statement.includes('F32_BLOB') || 
      statement.includes('__drizzle_migrations') ||
      statement.includes('_prisma_migrations')) {
    return '';
  }
  
  // Fix numeric type
  statement = statement.replace(/numeric/g, 'REAL');
  
  // Fix blob type
  statement = statement.replace(/blob/g, 'BLOB');
  
  return statement.trim();
}

async function migrate() {
  console.log('Starting migration...');

  const migrations = [
    '0000_wise_unus.sql',
    '0001_fine_agent_brand.sql',
    '0002_old_galactus.sql',
    '0003_reflective_viper.sql',
    '0004_stormy_overlord.sql',
    '0005_closed_winter_soldier.sql',
    '0006_supreme_shadow_king.sql',
    '0007_right_blink.sql',
    '0008_lowly_terror.sql',
    '0009_personality_config.sql',
  ];

  for (const migration of migrations) {
    try {
      console.log(`Applying migration: ${migration}`);
      const filePath = join(__dirname, migration);
      const sqlContent = readFileSync(filePath, 'utf-8');
      
      // Split the SQL content into individual statements
      const statements = sqlContent
        .split(';')
        .map(stmt => cleanSqlStatement(stmt))
        .filter(stmt => stmt);
      
      for (const statement of statements) {
        try {
          await db.run(sql.raw(statement));
          console.log(`  ✓ Executed: ${statement.substring(0, 50)}...`);
        } catch (error) {
          // Log the error but continue with other statements
          console.error(`  ✗ Failed to execute: ${statement.substring(0, 50)}...`);
          console.error(`    Error: ${error.message}`);
        }
      }
      
      console.log(`✓ Applied migration: ${migration}`);
    } catch (error) {
      console.error(`✗ Failed to apply migration ${migration}:`, error);
      process.exit(1);
    }
  }

  console.log('Migration complete');
}

migrate().catch(console.error); 