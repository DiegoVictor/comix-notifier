import { APIGatewayProxyEvent } from "aws-lambda";
import { subscribeForNotifications } from "@application/use_cases/subscribeForNotifications";

export const subscribe = async (event: APIGatewayProxyEvent) => {
  try {
    await subscribeForNotifications(token);
    return {
      statusCode: 204,
      body: "",
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        code: 500,
        message: "Ops! Something goes wrong, try again later.",
      }),
    };
};
