import { v4 as uuid } from "uuid";
import { document } from "../utils/dynamodbClient";

// interface ITodos {
//   title: string;
//   deadline: string;
// }

export const handle = async (event) => {
  const { user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body);

  const todo_id = uuid();

  await document
    .put({
      TableName: "todos",
      Item: {
        id: todo_id,
        user_id,
        title,
        done: false,
        deadline: new Date(deadline),
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Todo created!",
      user: {
        id: todo_id,
        user_id,
        title,
        done: false,
        deadline,
      },
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
