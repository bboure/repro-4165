import { SqsEnvelope } from '@aws-lambda-powertools/parser/envelopes/sqs';
import { parser } from '@aws-lambda-powertools/parser/middleware';
import { JSONStringified } from '@aws-lambda-powertools/parser/helpers';
import middy from '@middy/core';
import z from 'zod';
import { logger } from './logger.js';

const schema = z.object({
  user_id: z.number().int().positive(),
});

type NotificationPayload = z.infer<typeof schema>;

export const handler = middy<NotificationPayload[]>()
  .before((request) => {
    logger.info('Starting processing SQS event', {
      event: request.event,
    });
  })
  .onError((request) => {
    logger.info('Failed processing SQS event', { error: request.error });
  })
  .use(parser({ schema: JSONStringified(schema), envelope: SqsEnvelope }))
  .handler(async (records) => {
    logger.debug('Received records', { records });
  });
