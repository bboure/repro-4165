# Instructions

Clone the repository, then:

- run `npm ci` to install dependencies
- run `npm run cdk deploy` and follow the instructions to deploy the stack
- copy the producer function ARN from the stack outputs
- set it as an environment variable: `export FN_ARN=...`
- run the function with `aws lambda invoke --function-name $FN_ARN --invocation-type RequestResponse --log-type Tail --payload fileb://events/payload.json t.txt | jq -r .LogResult | base64 --decode` to see the logs
- check the consumer function logs in CloudWatch to see the processed messages

```sh
[/aws/lambda/SqsConsumerFn] 2:29:55 PM INIT_START Runtime Version: nodejs:22.v53        Runtime Version ARN: arn:aws:lambda:eu-west-1::runtime:95d75816ec5ca62f98dd61443748491f631a78c967b17393a9c60b763a4cb014
[/aws/lambda/SqsConsumerFn] 2:29:55 PM START RequestId: 00d7dc47-7e37-5171-b484-bd781bc728b9 Version: $LATEST
[/aws/lambda/SqsConsumerFn] 2:29:55 PM {"level":"INFO","message":"Lambda invocation event","timestamp":"2025-09-13T12:29:55.585Z","service":"sqs-consumer","sampling_rate":0,"xray_trace_id":"1-68c563c3-394f036b51c679fef6c93d0f","event":{"Records":[{"messageId":"a7aba0fe-627a-45b1-9cf0-f720dc032db7","receiptHandle":"AQEBu+OIyu0DvvsEdRmVlvzEe5dPUJ2whgHEfRFM0P0GgEqWayHU0Eh94TqeknrZIzqUkDY40PMtIgDP3E+xg1l9u+6ldFwM/9ecdfJ2CMwgO4Isx+9P5wA3/zZ/pzFiFJZCji8zmkcIfeWSURP5u+9D7FxZGqnSHuHOrNAP42463EB92qqm7G7vjqmonR7qlkWeqjHcO+ITH9IqqS5DPNeN0m8nYCIXPxCmv/c+gUzPM20QqFrUu/sFQVc9MagkjcmBjgzDb0g1xUUWbaXwh4CYV1CGygVXJdYKoLehCB8tCI5Z8jUvMT/N+yb0R8Ka4xHYD8yhOlzfQG3RSCxVw0tfAVNu5tuaAGzShpYftT4lbj7xbWVbMTp3lkmhJpZfOZZGqjyriTr2ppqJHKWzrbJBzg==","body":"{\"debug\":true,\"data\":[1,2,3]}","attributes":{"ApproximateReceiveCount":"1","AWSTraceHeader":"Root=1-68c563c1-1c676b964b597a606c1dfd90;Parent=713749d60fdfaa5e;Sampled=0;Lineage=1:283dea05:0","SentTimestamp":"1757766595227","SenderId":"AROAXZWZ5ZDPNHMBL2MDK:SqsProducerFn","ApproximateFirstReceiveTimestamp":"1757766595233"},"messageAttributes":{},"md5OfBody":"59436d4abf984e32b9fc20cbfee7c7d3","eventSource":"aws:sqs","eventSourceARN":"arn:aws:sqs:eu-west-1:123456789012:sqs-parser-test-queue","awsRegion":"eu-west-1"}]}}
[/aws/lambda/SqsConsumerFn] 2:29:55 PM {"level":"INFO","message":"Parsed SQS event OK","timestamp":"2025-09-13T12:29:55.690Z","service":"sqs-consumer","sampling_rate":0,"xray_trace_id":"1-68c563c3-394f036b51c679fef6c93d0f"}
[/aws/lambda/SqsConsumerFn] 2:29:55 PM {"level":"INFO","message":"Parsed SQS envelope OK","timestamp":"2025-09-13T12:29:55.691Z","service":"sqs-consumer","sampling_rate":0,"xray_trace_id":"1-68c563c3-394f036b51c679fef6c93d0f"}
[/aws/lambda/SqsConsumerFn] 2:29:55 PM {"level":"INFO","message":"Successfully parsed SQS event","timestamp":"2025-09-13T12:29:55.691Z","service":"sqs-consumer","sampling_rate":0,"xray_trace_id":"1-68c563c3-394f036b51c679fef6c93d0f","messageId":"a7aba0fe-627a-45b1-9cf0-f720dc032db7"}
[/aws/lambda/SqsConsumerFn] 2:29:55 PM END RequestId: 00d7dc47-7e37-5171-b484-bd781bc728b9
[/aws/lambda/SqsConsumerFn] 2:29:55 PM REPORT RequestId: 00d7dc47-7e37-5171-b484-bd781bc728b9   Duration: 128.75 ms        Billed Duration: 325 ms Memory Size: 128 MB     Max Memory Used: 80 MB  Init Duration: 195.71 ms
```
