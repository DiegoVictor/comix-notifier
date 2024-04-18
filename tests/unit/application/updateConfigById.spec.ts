import { faker } from '@faker-js/faker';

import { updateConfigById } from '@application/use_cases/updateConfigById';

const mockUpdateOneById = jest.fn();
jest.mock('@infra/repositories/config', () => ({
  updateOneById: (id: string, value: string[]) => mockUpdateOneById(id, value),
}));

describe('updateConfigById', () => {
  it('should be able to update a config by its id', async () => {
    const id = faker.string.uuid();
    const value = faker.lorem.words(3).split(/\s|,|\./);

    await updateConfigById<string[]>(id, value);

    expect(mockUpdateOneById).toHaveBeenCalledWith(id, value);
  });
});
