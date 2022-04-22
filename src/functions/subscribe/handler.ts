import { APIGatewayProxyEvent } from 'aws-lambda';
import { ZodError } from 'zod';

import { subscribeForNotifications } from '@application/use_cases/subscribeForNotifications';
import * as validate from '@application/validators/token';

export const subscribe = async (event: APIGatewayProxyEvent) => {
  try {
    const { token } = JSON.parse(event.body || '{}');

    validate.token({ token });

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
        message: 'Ops! Something goes wrong, try again later.',
      }),
    };
  }
};
