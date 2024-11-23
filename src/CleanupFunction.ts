import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { v4 } from "uuid";

const snsClient = new SNSClient({})
const dynamodbClient = new DynamoDBClient({})


export const handler = async(event: any) => {
    const TableName = process.env.TABLE_NAME;
    const TopicArn = process.env.TOPIC_ARN;

    console.log(event);

    return {
        statusCode: 200,
        body: 'Hi from Lambda',
    }
}