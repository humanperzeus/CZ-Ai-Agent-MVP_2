import {
  sqliteTable,
  uniqueIndex,
  text,
  numeric,
  integer,
  blob,
  customType,
} from 'drizzle-orm/sqlite-core';
import * as crypto from 'node:crypto';
import { sql } from 'drizzle-orm';

const float32Array = customType<{
  data: number[];
  config: { dimensions: number };
  configRequired: true;
  driverData: Buffer;
}>({
  dataType(config) {
    return `F32_BLOB(${config.dimensions})`;
  },
  fromDriver(value: Buffer) {
    return Array.from(new Float32Array(value.buffer));
  },
  toDriver(value: number[]) {
    return sql`vector32(${JSON.stringify(value)})`;
  },
});

export const bill = sqliteTable(
  'Bill',
  {
    id: text().primaryKey().notNull(),
    createdAt: numeric()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updatedAt: numeric()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    type: text().notNull(),
    number: integer().notNull(),
    congress: integer().notNull(),
    originChamber: text().notNull(),
    title: text().notNull(),
    url: text().notNull(),
    htmlVersionUrl: text().notNull(),
    pdfVersionUrl: text(),
    xmlVersionUrl: text(),
    content: blob().notNull(),
    summary: text().notNull(),
    impact: text().notNull(),
    funding: text().notNull(),
    spending: text().notNull(),
    introducedDate: text().notNull(),
    updateDate: text().notNull(),
    sponsorFirstName: text().notNull(),
    sponsorLastName: text().notNull(),
    sponsorParty: text().notNull(),
    sponsorInfoRaw: blob().notNull(),
  },
  table => [
    uniqueIndex('Bill_congress_number_type_key').on(
      table.congress,
      table.number,
      table.type,
    ),
  ],
);

export const document = sqliteTable('Document', {
  id: text().primaryKey().notNull(),
  createdAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  title: text().notNull(),
  url: text().notNull(),
  meta: blob(),
  content: blob(),
  source: text(),
});

export const billVector = sqliteTable('BillVector', {
  id: text().primaryKey().notNull(),
  createdAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  bill: text().references(() => bill.id, { onDelete: 'cascade' }),
  document: text().references(() => document.id, { onDelete: 'cascade' }),
  vector: float32Array({ dimensions: 1536 }).notNull(),
  text: text().notNull(),
  source: text().notNull(),
});

export const prismaMigrations = sqliteTable('_prisma_migrations', {
  id: text().primaryKey().notNull(),
  checksum: text().notNull(),
  finishedAt: numeric('finished_at'),
  migrationName: text('migration_name').notNull(),
  logs: text(),
  rolledBackAt: numeric('rolled_back_at'),
  startedAt: numeric('started_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
  appliedStepsCount: integer('applied_steps_count').default(0).notNull(),
});

export const chat = sqliteTable('Chat', {
  id: text().primaryKey().notNull(),
  createdAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  user: text()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  tweetId: text(),
});

export const message = sqliteTable('Message', {
  id: text().primaryKey().notNull(),
  createdAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  role: text().notNull(),
  chat: text()
    .notNull()
    .references(() => chat.id, { onDelete: 'cascade' }),
  text: text().notNull(),
  tweetId: text(),
  meta: blob(),
});

export const messageVector = sqliteTable('MessageVector', {
  id: text().primaryKey().notNull(),
  createdAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  message: text()
    .notNull()
    .references(() => message.id, { onDelete: 'cascade' }),
  vector: float32Array({ dimensions: 1536 }).notNull(),
  text: text().notNull(),
});

export const user = sqliteTable('User', {
  id: text().primaryKey().notNull(),
  createdAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  twitterId: text().notNull(),
});

export const drizzleMigrations = sqliteTable('__drizzle_migrations', {});

export const botConfig = sqliteTable('BotConfig', {
  id: text().primaryKey().$defaultFn(crypto.randomUUID).notNull(),
  createdAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
  key: text().notNull().unique(),
  value: text().notNull(),
});

export const content = sqliteTable(
  'Content',
  {
    id: text().primaryKey().notNull(),
    createdAt: numeric()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updatedAt: numeric()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    type: text().notNull(), // youtube, twitter, blog
    url: text().notNull(),
    title: text().notNull(),
    content: blob().notNull(),
    summary: text().notNull(),
    topics: text().notNull(), // JSON array of topics
    sentiment: numeric().notNull(),
    engagement: blob().notNull(), // JSON engagement metrics
    metadata: blob().notNull(), // Additional metadata
  }
);

export const contentVector = sqliteTable('ContentVector', {
  id: text().primaryKey().notNull(),
  createdAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  content: text().references(() => content.id, { onDelete: 'cascade' }),
  vector: float32Array({ dimensions: 1536 }).notNull(),
  vectorType: text().notNull(), // style, topic, sentiment
  text: text().notNull(),
  source: text().notNull(),
});

export const marketData = sqliteTable('MarketData', {
  id: text().primaryKey().notNull(),
  createdAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  symbol: text().notNull(),
  price: numeric().notNull(),
  volume: numeric().notNull(),
  marketCap: numeric().notNull(),
  change24h: numeric().notNull(),
  technicalIndicators: blob().notNull(), // JSON technical analysis data
  sentiment: numeric().notNull(),
  onChainMetrics: blob().notNull(), // JSON on-chain data
});

export const personalityConfig = sqliteTable('PersonalityConfig', {
  id: text().primaryKey().$defaultFn(crypto.randomUUID).notNull(),
  createdAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
  key: text().notNull().unique(),
  value: text().notNull(),
  category: text().notNull(),
  priority: integer().notNull(),
  isActive: integer().default(1).notNull(),
});

export const generatedContent = sqliteTable('GeneratedContent', {
  id: text().primaryKey().notNull(),
  createdAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  type: text().notNull(), // tweet, thread, analysis
  content: text().notNull(),
  topics: text().notNull(), // JSON array of topics
  marketContext: text().references(() => marketData.id),
  sourceContent: text().references(() => content.id),
  engagement: blob(), // JSON engagement metrics
  performance: blob(), // JSON performance metrics
  metadata: blob(), // Additional metadata
});

export const contentFeedback = sqliteTable('ContentFeedback', {
  id: text().primaryKey().notNull(),
  createdAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: numeric()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  contentId: text().references(() => generatedContent.id, { onDelete: 'cascade' }),
  type: text().notNull(), // engagement, sentiment, accuracy
  value: numeric().notNull(),
  metadata: blob(), // Additional feedback data
});
