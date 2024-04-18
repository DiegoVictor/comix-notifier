import { faker } from '@faker-js/faker';

import { IConfig } from '@application/contracts/IConfig';
import { create } from '@entities/Config';
import factory from '../../utils/factory';

const mockRandomUUID = jest.fn();
jest.mock('crypto', () => ({
  randomUUID: () => mockRandomUUID(),
}));

describe('Config.create', () => {
  it('should be able to create a config instance', async () => {
    const { id, name, value } =
      await factory.attrs<IConfig<{ [key: string]: number }>>('Config');

    expect(create({ id, name, value })).toStrictEqual({ id, name, value });
  });

  it('should be able to create a config instance with id', async () => {
    const { name, value } =
      await factory.attrs<IConfig<{ [key: string]: number }>>('Config');

    const id = faker.number.int();
    mockRandomUUID.mockReturnValueOnce(id);

    expect(create({ name, value })).toStrictEqual({ id, name, value });
  });
});
