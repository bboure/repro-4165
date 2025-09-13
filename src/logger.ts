import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({
  serviceName: 'sqs-consumer',
  logLevel: 'INFO',
});

export { logger };
