import type { SQSHandler } from 'aws-lambda';
import { logger } from './logger.js';
import { SqsEnvelope } from '@aws-lambda-powertools/parser/envelopes/sqs';
import { SqsSchema, SqsRecordSchema } from '@aws-lambda-powertools/parser/schemas/sqs';
import { z } from 'zod/v4';

export const handler: SQSHandler = async (event) => {
  logger.logEventIfEnabled(event, true);

  const parsedEvent = SqsSchema.safeParse(event);
  if (!parsedEvent.success) {
    logger.error('Failed to parse SQS event', { error: parsedEvent.error });
    return;
  }
  logger.info('Parsed SQS event OK');

  const records = SqsEnvelope.safeParse(event, z.any());
  if (!records.success) {
    logger.error('Failed to parse SQS envelope', { error: records.error });
    return;
  }
  logger.info('Parsed SQS envelope OK');

  for (const record of event.Records) {
    try {
      // Use Powertools Parser with SQS schema
      const parseResult = SqsRecordSchema.safeParse(record);

      if (parseResult.success) {
        logger.info('Successfully parsed SQS event', {
          messageId: record.messageId,
        });
      } else {
        logger.error('Failed to parse SQS event', {
          messageId: record.messageId,
          error: parseResult.error,
          originalMessage: record
        });
      }
    } catch (error) {
      logger.error('Unexpected error processing SQS record', {
        messageId: record.messageId,
        error
      });
    }
  }
};
