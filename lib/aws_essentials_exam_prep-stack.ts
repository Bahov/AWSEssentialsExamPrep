import { TimeToLiveStatus } from '@aws-sdk/client-dynamodb';
import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, StreamViewType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Architecture, FilterCriteria, FilterRule, Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Subscription, SubscriptionProtocol, Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

export class AwsEssentialsExamPrepStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create DynamoDB table to log errors
    const ErrorTable = new Table(this, 'ErrorTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'TTL',
      stream: StreamViewType.NEW_AND_OLD_IMAGES
    });

      // create SNS topic/subscription
      const ErrorTopic = new Topic(this, 'ErrorTopic', {
        topicName: 'ErrorTopic'
      })
      new Subscription(this, 'ErrorSubscription',{
        topic: ErrorTopic,
        protocol: SubscriptionProtocol.EMAIL,
        endpoint: 'tsvetomir.bahov@gmail.com'
      });

    // create function to process JSON files
    const ProcessJSONFunction = new NodejsFunction(this, 'ProcessJSONFunction', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: `${__dirname}/../src/ProcessJSONFunction.ts`,
      architecture: Architecture.ARM_64,
      memorySize: 128,
      environment: {
        TABLE_NAME: ErrorTable.tableName,
        TOPIC_ARN: ErrorTopic.topicArn
      }
    });

    ErrorTopic.grantPublish(ProcessJSONFunction);
    ErrorTable.grantReadWriteData(ProcessJSONFunction);

    // create function to cleanup invalid JSON files
    const CleanupFunction = new NodejsFunction(this, 'CleanupFunction', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: `${__dirname}/../src/CleanupFunction.ts`,
      architecture: Architecture.ARM_64,
      memorySize: 128,
      environment: {
        TABLE_NAME: ErrorTable.tableName,
        TOPIC_ARN: ErrorTopic.topicArn
      }
    });

    ErrorTopic.grantPublish(CleanupFunction);
    ErrorTable.grantReadWriteData(CleanupFunction);

    CleanupFunction.addEventSource(new DynamoEventSource(ErrorTable, {
      startingPosition: StartingPosition.LATEST,
      batchSize: 5,
      filters: [
        FilterCriteria.filter({
          eventName: FilterRule.isEqual('REMOVE')
        })
      ]
    }));

    // create RestApi
    const MyRestApi = new RestApi(this, 'MyRestApi');
    const ApiResource = MyRestApi.root.addResource('ProcessJSON');
    ApiResource.addMethod('POST', new LambdaIntegration(ProcessJSONFunction));

    // outputs
    new cdk.CfnOutput(this, 'MyRestApiEndpoint', {
      value: `https://${MyRestApi.restApiId}.execute-api.eu-central-1.amazonaws.com/prod/processJSON`
    })
  }
}
