import { Stack, type StackProps, CfnOutput, RemovalPolicy, Duration } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class SqsMd5AttrsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create SQS Queue
    const queue = new Queue(this, 'TestQueue', {
      queueName: 'sqs-parser-test-queue',
      visibilityTimeout: Duration.seconds(300),
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Producer Lambda Function
    const producerLogGroup = new LogGroup(this, 'ProducerLogGroup', {
      logGroupName: '/aws/lambda/SqsProducerFn',
      removalPolicy: RemovalPolicy.DESTROY,
      retention: RetentionDays.ONE_DAY,
    });

    const producerFn = new NodejsFunction(this, 'ProducerFunction', {
      functionName: 'SqsProducerFn',
      logGroup: producerLogGroup,
      runtime: Runtime.NODEJS_22_X,
      entry: './src/producer.ts',
      handler: 'handler',
      environment: {
        QUEUE_URL: queue.queueUrl,
      },
      bundling: {
        minify: true,
        mainFields: ['module', 'main'],
        sourceMap: true,
        format: OutputFormat.ESM,
      },
    });

    // Consumer Lambda Function
    const consumerLogGroup = new LogGroup(this, 'ConsumerLogGroup', {
      logGroupName: '/aws/lambda/SqsConsumerFn',
      removalPolicy: RemovalPolicy.DESTROY,
      retention: RetentionDays.ONE_DAY,
    });

    const consumerFn = new NodejsFunction(this, 'ConsumerFunction', {
      functionName: 'SqsConsumerFn',
      logGroup: consumerLogGroup,
      runtime: Runtime.NODEJS_22_X,
      entry: './src/consumer.ts',
      handler: 'handler',
      bundling: {
        minify: true,
        mainFields: ['module', 'main'],
        sourceMap: true,
        format: OutputFormat.ESM,
      },
    });

    // Grant permissions
    queue.grantSendMessages(producerFn);
    queue.grantConsumeMessages(consumerFn);

    // Add SQS event source to consumer
    consumerFn.addEventSource(new SqsEventSource(queue, {
      batchSize: 10,
    }));

    // Outputs
    new CfnOutput(this, 'QueueUrl', {
      value: queue.queueUrl,
      exportName: 'SqsParserTestQueueUrl',
    });

    new CfnOutput(this, 'ProducerFunctionArn', {
      value: producerFn.functionArn,
      exportName: 'SqsProducerFunctionArn',
    });

    new CfnOutput(this, 'ConsumerFunctionArn', {
      value: consumerFn.functionArn,
      exportName: 'SqsConsumerFunctionArn',
    });
  }
}