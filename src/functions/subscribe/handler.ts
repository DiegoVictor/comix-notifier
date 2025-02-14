import { APIGatewayProxyEvent } from 'aws-lambda';
import { ZodError } from 'zod';

import { subscribeForNotifications } from '@application/use_cases/subscribeForNotifications';
import * as validate from '@application/validators/token';

export const subscribe = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { token } = validate.token(body);

    await subscribeForNotifications(token);
    return {
      statusCode: 204,
      body: '',
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);

    if (err instanceof ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify(err.errors),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        code: 500,
        message: 'Oops! Something goes wrong, try again later.',
      }),
    };
  }
};
