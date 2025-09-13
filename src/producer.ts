import { getStringFromEnv } from '@aws-lambda-powertools/commons/utils/env';
import { logger } from './logger.js';
import { SQSClient, SendMessageBatchCommand, type SendMessageBatchRequestEntry } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({});
const queueUrl = getStringFromEnv({ key: 'QUEUE_URL', errorMessage: 'QUEUE_URL environment variable not set' });

export const sendMessageBatch = async (
  queueUrl: string,
  messages: Array<{
    id: string;
    body: string;
    delayInSeconds?: number;
  }>,
) => {
  const entries: SendMessageBatchRequestEntry[] = messages.map((message) => ({
    Id: message.id,
    MessageBody: message.body,
    DelaySeconds: message.delayInSeconds,
  }));

  const command = new SendMessageBatchCommand({
    QueueUrl: queueUrl,
    Entries: entries,
  });

  await sqsClient.send(command);
};

export const handler = async (event: unknown) => {
  try {
    const events = [
      { id: '123', body: JSON.stringify({ foo: 'bar' }) },
      { id: '456', body: JSON.stringify({ test: 'message', timestamp: Date.now() }) },
      { id: '789', body: JSON.stringify({ debug: true, data: [1, 2, 3] }) },
    ];

    await sendMessageBatch(queueUrl, events);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Messages sent successfully',
        count: events.length
      }),
    };
  } catch (error) {
    logger.error('Error sending messages:', { error });
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to send messages',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};