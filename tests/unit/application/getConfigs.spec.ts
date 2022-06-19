import { faker } from '@faker-js/faker';

import { IConfig } from '@application/contracts/IConfig';
import { getConfigs } from '@application/use_cases/getConfigs';
import factory from '../../utils/factory';

const mockGetOneByName = jest.fn();
const mockCreateOne = jest.fn();
jest.mock('@infra/repositories/config', () => ({
  getOneByName: (name: string) => mockGetOneByName(name),
  createOne: (config: IConfig<Record<string, number>>) => mockCreateOne(config),
}));

const mockCreate = jest.fn();
jest.mock('@entities/Config', () => ({
  create: (config: Record<string, any>) => mockCreate(config),
}));

describe('getConfigs', () => {
  it('should be able to get existing and create non existing configs', async () => {
    const urls = [faker.internet.url()];
    const catalog = await factory.attrs<IConfig<Record<string, number>>>(
      'Config'
    );

    mockGetOneByName.mockResolvedValueOnce(urls);
    mockGetOneByName.mockResolvedValueOnce(undefined);
    mockCreate.mockImplementation(() => catalog);
    mockCreateOne.mockResolvedValueOnce(catalog);

    const configs = await getConfigs();

    expect(mockGetOneByName).toHaveBeenCalledWith('urls');
    expect(mockGetOneByName).toHaveBeenCalledWith('catalog');
    expect(mockCreate).toHaveBeenCalledWith({
      name: 'catalog',
      value: {},
    });
    expect(configs).toContainEqual(urls);
    expect(configs).toContainEqual(catalog);
    expect(mockCreateOne).toHaveBeenCalledWith(catalog);
  });
});
