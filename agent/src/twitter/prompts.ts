import { botConfig, db, eq } from 'database';
import { bento } from '../cache';
import Handlebars from 'handlebars';

export const QUESTION_EXTRACTOR_SYSTEM_PROMPT = `You are an advanced text analysis assistant specialized in crypto and blockchain topics. Your task is to extract discussion points or questions from tweets. Follow these guidelines:

1. Direct Questions:
  - If the text contains a direct question about crypto, blockchain, or exchanges, return that question exactly as it appears.
  - Example: 
    - Text: "@cz_binance thoughts on the market?"
      - Output: "Thoughts on the market?"

2. Statements or Observations:
  - If the text is a statement about crypto markets, industry, or technology, rephrase it as a discussion point.
  - Examples:
    - Text: "Bitcoin looking strong today"
      - Output: "Analysis of Bitcoin's current market strength"
    - Text: "These gas fees are crazy"
      - Output: "Discussion on current gas fee situation"

3. Implied Questions:
  - If the text implies a question about crypto markets, security, or industry developments, rephrase it into a clear point.
  - Examples:
    - Text: "Not sure about these new DEX developments."
      - Output: "Analysis of recent DEX developments"
    - Text: "The market seems to be turning bullish."
      - Output: "Market sentiment analysis and bullish indicators"

4. General Engagement:
  - For general comments or observations, extract the main topic for discussion.
  - Example:
    - Text: "Great work on the new security features"
      - Output: "Discussion on recent security improvements"

Never respond with NO_QUESTION_DETECTED. Instead, always find a relevant discussion point in the content.`;

export const MARKET_ANALYSIS_PROMPT = `You are CZ (Changpeng Zhao), analyzing market conditions and industry developments. Your analysis should focus on:

1. Market Trends
   - Price movements
   - Trading volumes
   - Market sentiment

2. Industry Developments
   - Regulatory updates
   - Technology advancements
   - Security considerations

3. Exchange Operations
   - Platform stability
   - User protection
   - Service improvements

Maintain a professional, measured tone and focus on factual analysis.`;

export const CRYPTO_NEWS_ANALYSIS_PROMPT = `As CZ, analyze crypto news and developments with focus on:

1. Industry Impact
   - Market effects
   - User implications
   - Technology advancement

2. Security Implications
   - Platform safety
   - User protection
   - Risk management

3. Regulatory Considerations
   - Compliance requirements
   - Global implications
   - Industry standards

Provide clear, professional insights with a global perspective.`;

export const ANALYZE_TEXT_FROM_IMAGE = `Analyze the provided image and extract all visible text exactly as it appears. Do not add any commentary or descriptions. If no text is found, return only 'NO_TEXT_FOUND'.`;

export const PROMPTS = {
  SYSTEM_PROMPT: async () => {
    return bento.getOrSet(
      'BOT_CONFIG_SYSTEM_PROMPT',
      async () => {
        const prompt = await db.query.botConfig.findFirst({
          where: eq(botConfig.key, 'SYSTEM_PROMPT'),
          columns: {
            value: true,
          },
        });

        if (!prompt) {
          throw new Error('SYSTEM_PROMPT not found');
        }

        return prompt.value;
      },
      { ttl: '1d' },
    );
  },
  INTERACTION_SYSTEM_PROMPT: async () => {
    return bento.getOrSet(
      'BOT_CONFIG_INTERACTION_SYSTEM_PROMPT',
      async () => {
        const prompt = await db.query.botConfig.findFirst({
          where: eq(botConfig.key, 'INTERACTION_SYSTEM_PROMPT'),
          columns: {
            value: true,
          },
        });

        if (!prompt) {
          throw new Error('INTERACTION_SYSTEM_PROMPT not found');
        }

        return prompt.value;
      },
      { ttl: '1d' },
    );
  },
  INTERACTION_REFINE_OUTPUT_PROMPT: async ({ topic }: { topic: string }) => {
    const prompt = await bento.getOrSet(
      'BOT_CONFIG_INTERACTION_REFINE_OUTPUT_PROMPT',
      async () => {
        const prompt = await db.query.botConfig.findFirst({
          where: eq(botConfig.key, 'INTERACTION_REFINE_OUTPUT_PROMPT'),
          columns: {
            value: true,
          },
        });

        if (!prompt) {
          throw new Error('INTERACTION_REFINE_OUTPUT_PROMPT not found');
        }

        return prompt.value;
      },
      { ttl: '1d' },
    );
    const templatedPrompt = Handlebars.compile(prompt);
    return templatedPrompt({ topic });
  },
  TWITTER_REPLY_TEMPLATE: async () => {
    return bento.getOrSet(
      'BOT_CONFIG_TWITTER_REPLY_TEMPLATE',
      async () => {
        const prompt = await db.query.botConfig.findFirst({
          where: eq(botConfig.key, 'TWITTER_REPLY_TEMPLATE'),
          columns: {
            value: true,
          },
        });

        if (!prompt) {
          throw new Error('TWITTER_REPLY_TEMPLATE not found');
        }

        return prompt.value;
      },
      { ttl: '1d' },
    );
  },
  REPLY_SHORTENER_PROMPT: async () => {
    return bento.getOrSet(
      'BOT_CONFIG_REPLY_SHORTENER_PROMPT',
      async () => {
        const prompt = await db.query.botConfig.findFirst({
          where: eq(botConfig.key, 'REPLY_SHORTENER_PROMPT'),
          columns: {
            value: true,
          },
        });

        if (!prompt) {
          throw new Error('REPLY_SHORTENER_PROMPT not found');
        }

        return prompt.value;
      },
      { ttl: '1d' },
    );
  },
  REPLY_TWEET_QUESTION_PROMPT: async ({
    question,
    lastDogeReply,
    fullContext,
  }: {
    question: string;
    lastDogeReply: string;
    fullContext: string;
  }) => {
    const prompt = await bento.getOrSet(
      'BOT_CONFIG_REPLY_TWEET_QUESTION_PROMPT',
      async () => {
        const prompt = await db.query.botConfig.findFirst({
          where: eq(botConfig.key, 'REPLY_TWEET_QUESTION_PROMPT'),
          columns: {
            value: true,
          },
        });

        if (!prompt) {
          throw new Error('REPLY_TWEET_QUESTION_PROMPT not found');
        }

        return prompt.value;
      },
      { ttl: '1d' },
    );
    const templatedPrompt = Handlebars.compile(prompt);
    return templatedPrompt({ question, lastDogeReply, fullContext });
  },
  INTERACTION_ENGAGEMENT_DECISION_PROMPT: async () => {
    return bento.getOrSet(
      'BOT_CONFIG_INTERACTION_ENGAGEMENT_DECISION_PROMPT',
      async () => {
        const prompt = await db.query.botConfig.findFirst({
          where: eq(botConfig.key, 'INTERACTION_ENGAGEMENT_DECISION_PROMPT'),
          columns: {
            value: true,
          },
        });

        if (!prompt) {
          throw new Error('INTERACTION_ENGAGEMENT_DECISION_PROMPT not found');
        }

        return prompt.value;
      },
      { ttl: '1d' },
    );
  },
  ENGAGEMENT_DECISION_PROMPT: async () => {
    return bento.getOrSet(
      'BOT_CONFIG_ENGAGEMENT_DECISION_PROMPT',
      async () => {
        const prompt = await db.query.botConfig.findFirst({
          where: eq(botConfig.key, 'ENGAGEMENT_DECISION_PROMPT'),
          columns: {
            value: true,
          },
        });

        if (!prompt) {
          throw new Error('ENGAGEMENT_DECISION_PROMPT not found');
        }

        return prompt.value;
      },
      { ttl: '1d' },
    );
  },
  LONG_RESPONSE_FORMATTER_PROMPT: async () => {
    return bento.getOrSet(
      'BOT_CONFIG_LONG_RESPONSE_FORMATTER_PROMPT',
      async () => {
        const prompt = await db.query.botConfig.findFirst({
          where: eq(botConfig.key, 'LONG_RESPONSE_FORMATTER_PROMPT'),
          columns: {
            value: true,
          },
        });

        if (!prompt) {
          throw new Error('LONG_RESPONSE_FORMATTER_PROMPT not found');
        }

        return prompt.value;
      },
      { ttl: '1d' },
    );
  },
};
