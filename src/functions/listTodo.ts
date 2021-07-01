import { document } from "src/utils/dynamodbClient";

export const handle = async (event) => {
  const { user_id } = event.pathParameters;

  const resp = await document
    .query({
      TableName: "todos",
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": user_id,
      },
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify(resp.Items),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
