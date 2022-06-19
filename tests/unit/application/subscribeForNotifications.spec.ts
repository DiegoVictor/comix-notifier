import { faker } from '@faker-js/faker';

import { subscribeForNotifications } from '@application/use_cases/subscribeForNotifications';

const mockSubscribe = jest.fn();
jest.mock('@infra/services/notification', () => ({
  subscribe: (token: string) => mockSubscribe(token),
}));

describe('subscribeForNotifications', () => {
  it('should be able to subscribe', async () => {
    const token = faker.random.alphaNumeric(32);

    await subscribeForNotifications(token);

    expect(mockSubscribe).toHaveBeenCalledWith(token);
  });
});
