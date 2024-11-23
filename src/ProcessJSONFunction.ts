import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { v4 } from "uuid";

const snsClient = new SNSClient({})
const dynamodbClient = new DynamoDBClient({})


export const handler = async(event: any) => {
    const TableName = process.env.TABLE_NAME;
    const TopicArn = process.env.TOPIC_ARN;

    console.log(event)

    const EventBody = JSON.parse(event.body)

    console.log(EventBody)

    if (!EventBody || !EventBody.text) { // either there is not body or there is no key "text" in the body
        // Invalid JSON 
        const ttl = Math.floor(Date.now() / 1000) + 2 * 60; 
        await dynamodbClient.send(new PutItemCommand({
            TableName: TableName,
            Item: {
                PK: {
                    S: v4(),
                },
                ErrorMessage: {
                    S: 'Your JSON was not validated successfully!',
                },
                ttl: {
                    N: ttl.toString(),
                },
                TTL: {
                    N: ttl.toString(),
                }

            }
        }))
    } else {
        // Publish to SNS
        await snsClient.send(new PublishCommand({
            TopicArn: TopicArn,
            Message: `Valid JSON received: ${EventBody.text}`
        }));
        console.log('Notification sent.')
    }

    return {
        statusCode: 200,
        body: 'Hi from Lambda',
    }
}