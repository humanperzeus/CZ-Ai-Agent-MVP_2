import * as readline from 'node:readline/promises';
import { CoreMessage, generateText } from 'ai';
import { SEED, TEMPERATURE } from '../const';
import { openai } from '@ai-sdk/openai';
import { PROMPTS, QUESTION_EXTRACTOR_SYSTEM_PROMPT } from '../twitter/prompts';
import { generateReply, getTweetContext } from '../twitter/execute';
import { logger } from '../logger';
import { getKbContext } from '../twitter/knowledge-base';

const log = logger.child({ module: 'cli-reply-twitter' });

/**
 * Testing replies on a tweet where CZ gets pinged.
 */
async function main() {
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const tweetUrl = await terminal.question('Enter the tweet URL: ');
    terminal.close();

    const tweetId = tweetUrl.split('/').pop();
    if (!tweetId) {
      throw new Error('No tweet ID found in the provided URL.');
    }

    const tweetThread = await getTweetContext({ id: tweetId }, log);
    const tweetWeRespondingTo = tweetThread.pop();

    if (!tweetWeRespondingTo) {
      throw new Error('No tweet found to respond to.');
    }

    const { text: discussionPoint } = await generateText({
      model: openai('gpt-4o'),
      temperature: TEMPERATURE,
      seed: SEED,
      messages: [
        {
          role: 'system',
          content: QUESTION_EXTRACTOR_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content:
            tweetWeRespondingTo.role === 'user'
              ? tweetWeRespondingTo.content
              : '',
        },
      ],
    });

    log.info({ discussionPoint }, 'extracted discussion point');

    const messages: Array<CoreMessage> = [];
    const fullThread = [...tweetThread, tweetWeRespondingTo!];
    const kb = await getKbContext(
      {
        messages: fullThread,
        text: discussionPoint,
      },
      log,
    );

    if (kb?.documents) {
      messages.push({
        role: 'user',
        content: `Documents Context: ${kb.documents}\n\n`,
      });
    }

    const fullContext = tweetThread.map(({ content }) => content).join('\n\n');
    const previousTweet =
      tweetThread?.[tweetThread.length - 1]?.content.toString() || '';
    const content = await PROMPTS.REPLY_TWEET_QUESTION_PROMPT({
      question: discussionPoint,
      lastDogeReply: previousTweet,
      fullContext,
    });
    messages.push({
      role: 'user',
      content,
    });
    messages.push({
      role: 'user',
      content: `now respond to this point: "${discussionPoint}"`,
    });

    log.info(
      {
        messages,
      },
      'context given',
    );

    const { text, metadata, formatted } = await generateReply({
      messages,
    });

    if (metadata) {
      console.log('\n\nMetadata: ', metadata, '\n\n');
    }
    console.log('\n\nResponse: ', text, '\n\n');
    console.log('\n\nFormatted: ', formatted, '\n\n');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main().catch(console.error);
