import { document } from "../utils/dynamodbClient";
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";

interface IUser {
  id: string;
  username: string;
  password: string;
}

export const handle = async (event) => {
  const { username, password } = JSON.parse(event.body) as IUser;
  // consultar se o usuário existe

  const resp = await document
    .scan({
      TableName: "users",
      ProjectionExpression: "username, id",
    })
    .promise();

  const [userAlreadyExists] = resp.Items.filter(
    (user) => user.username === username
  );

  if (userAlreadyExists) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "User Already Exists",
      }),
      headers: {
        "Content-Type": "applicattion/json",
      },
    };
  }
  //se não existir, criar

  const user_id = uuid();

  await document
    .put({
      TableName: "users",
      Item: {
        id: user_id,
        username,
        password: hash(password, 10),
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "User created!!!",
      user: {
        id: user_id,
        username,
      },
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
