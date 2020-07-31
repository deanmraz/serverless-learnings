import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const Dynamo = new DocumentClient();

export default async event => {

  const records = event.Records;

  // need to loop through records since sqs can batch up to 10
  const item = records[0];

  // sns body
  const body = JSON.parse(item.body);

  // actual message sent from gateway
  const dynamodbRecord = JSON.parse(body.Message);

  await Dynamo
  .put({
    TableName: 'TableName',
    Item: {
      ...dynamodbRecord, // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax 
      status: 'pending', 
    },
  })
  .promise();


  //.... Do your business logic 
  try {
    await ExecuteBusinessLogic(item)
    await Dynamo
    .put({
      TableName: 'TableName',
      Item: {
        ...dynamodbRecord,
        status: 'success', 
      },
    })
    .promise();
    return {
      status: 'okay',
    };
  } catch (e) {
    await Dynamo
    .put({
      TableName: 'TableName',
      Item: {
        ...dynamodbRecord,
        status: 'failed', 
        error: e,
      },
    })
    .promise();
    throw e; // rethrow so cloudwatch marks it as failed 
  }
}


const ExecuteBusinessLogic = async (event) => {
  //Do your business logic 
}