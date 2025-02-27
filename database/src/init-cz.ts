import { db } from './client';
import { sql } from 'drizzle-orm';
import * as crypto from 'node:crypto';
import {
  CZ_VOICE_CHARACTERISTICS,
  CZ_CONTENT_STYLE,
  CZ_ENGAGEMENT_RULES,
  CZ_CONTENT_PREFERENCES,
  CZ_MARKET_ANALYSIS,
  CZ_EDUCATIONAL_STYLE,
  CZ_HUMOR_STYLE,
  CZ_RISK_WARNINGS,
  CZ_COMMUNITY_GUIDELINES,
} from './personas/cz';

async function initCZPersonality() {
  const configs = [
    { key: 'CZ_VOICE_CHARACTERISTICS', value: CZ_VOICE_CHARACTERISTICS, category: 'voice', priority: 1 },
    { key: 'CZ_CONTENT_STYLE', value: CZ_CONTENT_STYLE, category: 'style', priority: 1 },
    { key: 'CZ_ENGAGEMENT_RULES', value: CZ_ENGAGEMENT_RULES, category: 'engagement', priority: 1 },
    { key: 'CZ_CONTENT_PREFERENCES', value: CZ_CONTENT_PREFERENCES, category: 'content', priority: 1 },
    { key: 'CZ_MARKET_ANALYSIS', value: CZ_MARKET_ANALYSIS, category: 'content', priority: 2 },
    { key: 'CZ_EDUCATIONAL_STYLE', value: CZ_EDUCATIONAL_STYLE, category: 'style', priority: 2 },
    { key: 'CZ_HUMOR_STYLE', value: CZ_HUMOR_STYLE, category: 'style', priority: 3 },
    { key: 'CZ_RISK_WARNINGS', value: CZ_RISK_WARNINGS, category: 'content', priority: 2 },
    { key: 'CZ_COMMUNITY_GUIDELINES', value: CZ_COMMUNITY_GUIDELINES, category: 'engagement', priority: 2 },
  ];

  console.log('Initializing CZ personality configuration...');

  for (const config of configs) {
    try {
      // First try to update
      const updateQuery = sql`
        UPDATE PersonalityConfig 
        SET value = ${config.value},
            category = ${config.category},
            priority = ${config.priority}
        WHERE key = ${config.key}
      `;
      const result = await db.run(updateQuery);

      // If no rows were updated, insert
      if (result.rowsAffected === 0) {
        const insertQuery = sql`
          INSERT INTO PersonalityConfig (id, key, value, category, priority, isActive) 
          VALUES (${crypto.randomUUID()}, ${config.key}, ${config.value}, ${config.category}, ${config.priority}, 1)
        `;
        await db.run(insertQuery);
      }

      console.log(`✓ Initialized ${config.key}`);
    } catch (error) {
      console.error(`✗ Failed to initialize ${config.key}:`, error);
    }
  }

  console.log('CZ personality configuration initialization complete');
}

initCZPersonality().catch(console.error); 