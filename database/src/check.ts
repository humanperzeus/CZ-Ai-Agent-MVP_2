import { db } from './client';
import { sql } from 'drizzle-orm';

async function checkTables() {
  console.log('Checking database tables...');

  try {
    // Check PersonalityConfig table
    const personalityConfigs = await db.run(sql`SELECT * FROM PersonalityConfig`);
    console.log('\nPersonalityConfig entries:', personalityConfigs.rows.length);
    for (const config of personalityConfigs.rows) {
      console.log(`- ${config.key} (${config.category}, priority: ${config.priority})`);
    }

    // Check BotConfig table
    const botConfigs = await db.run(sql`SELECT * FROM BotConfig`);
    console.log('\nBotConfig entries:', botConfigs.rows.length);
    for (const config of botConfigs.rows) {
      console.log(`- ${config.key}`);
    }

  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

checkTables().catch(console.error); 