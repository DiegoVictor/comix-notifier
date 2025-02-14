import { faker } from '@faker-js/faker';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ZodError, ZodIssueCode, ZodParsedType } from 'zod';

import { subscribe } from '@functions/subscribe/handler';

const mockToken = jest.fn();
jest.mock('@application/validators/token', () => ({
  token: (data: Record<string, any>) => mockToken(data),
}));

const mockSubscribeForNotifications = jest.fn();
jest.mock('@application/use_cases/subscribeForNotifications', () => ({
  subscribeForNotifications: (token: string) =>
    mockSubscribeForNotifications(token),
}));

describe('subscribe', () => {
  it('should not be able to subscribe with an invalid token', async () => {
    const token = 'invalid-token';
    const error = {
      message: 'fake error message',
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.integer,
      received: ZodParsedType.boolean,
      path: [''],
    };
    const zodError = new ZodError([error]);

    mockToken.mockImplementationOnce(() => {
      throw zodError;
    });

    const log = jest.spyOn(console, 'log');
    log.mockImplementationOnce(() => {});

    const response = await subscribe({
      body: JSON.stringify({ token }),
    } as APIGatewayProxyEvent);

    expect(mockToken).toHaveBeenCalledWith({ token });
    expect(log).toHaveBeenCalledWith(zodError);
    expect(response).toStrictEqual({
      statusCode: 400,
      body: JSON.stringify([error]),
    });
  });

  it('should not be able to subscribe without a token', async () => {
    const error = {
      message: 'fake error message',
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.integer,
      received: ZodParsedType.boolean,
      path: [''],
    };
    const zodError = new ZodError([error]);

    mockToken.mockImplementationOnce(() => {
      throw zodError;
    });

    const log = jest.spyOn(console, 'log');
    log.mockImplementationOnce(() => {});

    const response = await subscribe({} as APIGatewayProxyEvent);

    expect(mockToken).toHaveBeenCalledWith({ token: undefined });
    expect(log).toHaveBeenCalledWith(zodError);
    expect(response).toStrictEqual({
      statusCode: 400,
      body: JSON.stringify([error]),
    });
  });

  it('should not be able to subscribe when an unexpected error occurs', async () => {
    const token = faker.string.alphanumeric(32);

    const log = jest.spyOn(console, 'log');
    log.mockImplementationOnce(() => {});

    const error = new Error('Test Error');
    mockSubscribeForNotifications.mockImplementationOnce(() => {
      throw error;
    });

    mockToken.mockReturnValueOnce({ token });

    const response = await subscribe({
      body: JSON.stringify({ token }),
    } as APIGatewayProxyEvent);

    expect(mockToken).toHaveBeenCalledWith({ token });
    expect(log).toHaveBeenCalledWith(error);
    expect(response).toStrictEqual({
      statusCode: 500,
      body: JSON.stringify({
        code: 500,
        message: 'Oops! Something goes wrong, try again later.',
      }),
    });
  });

  it('should be able to subscribe with a valid token', async () => {
    const token = faker.string.alphanumeric(32);

    mockToken.mockReturnValueOnce({ token });

    const response = await subscribe({
      body: JSON.stringify({ token }),
    } as APIGatewayProxyEvent);

    expect(mockToken).toHaveBeenCalledWith({ token });
    expect(mockSubscribeForNotifications).toHaveBeenCalledWith(token);
    expect(response).toStrictEqual({
      statusCode: 204,
      body: '',
    });
  });
});
