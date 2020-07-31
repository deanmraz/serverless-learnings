import AwsSns from 'aws-sdk/clients/sns';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export default async event => {

  // TODO create dynamodb record
  const created = await new DocumentClient()
  .put({
    TableName: 'TableName',
    Item: {
      PK: '', // PK is the attr configured as primary key during dynamodb setup
      SK: '', // SK is the secondary key that needs to be unique between the set of data 
      url: '', // then the other data you'll want to put on the item, 
      status: 'pending', 
    },
  })
  .promise();

  const sns = new AwsSns();
  const response = await sns
  .publish({
    TopicArn: process.env.SNS_TOPIC, // configured in the serverless.yml under environment
    Message: JSON.stringify(data),
  })
  .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(created),
  };
}
