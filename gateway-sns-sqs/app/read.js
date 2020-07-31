import AwsSns from 'aws-sdk/clients/sns';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const Dynamo = new DocumentClient();

export default async event => {

  const PK = event.queryStringParameters?.PK;
  // probably should validate that PK exists if not throw a response error 
  if (!PK) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        errors: ['PK required']
      }),
    };
  }
  const SK = event.queryStringParameters?.SK;
  if (PK && SK) {
    const item = await findRecord(PK, SK);
    return {
      statusCode: 200,
      body: JSON.stringify(item),
    };
  } else {
    const collection = await findAll(PK);
    return {
      statusCode: 200,
      body: JSON.stringify(collection),
    };
  }
}


const findRecord = async (PK, SK) => {
  const response = await Dynamo
    .get({
      TableName: 'TableName',
      Key: {
        PK,
        SK
      }
    })
    .promise();
  if (response && response.Item) {
    return response.Item;
  } else {
    return null;
  }
}

const findAll = async (PK) => {
  const response = await this.db.query({
    TableName: 'TableName',
    Limit: 1000,
    ScanIndexForward: false, // false = desc true = asc
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: {
      ':pk': PK,
    },
  }).promise();
  const items = response.Items || [];
  if (items.length > 0) {
    return items;
  } else {
    return [];
  }
}