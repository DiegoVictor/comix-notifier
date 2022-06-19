import { faker } from '@faker-js/faker';

import { IVolume } from '@application/contracts/IVolume';
import { updateCatalog } from '@application/use_cases/updateCatalog';
import factory from '../../utils/factory';

describe('updateCatalog', () => {
  it('should be able to update catalog', async () => {
    const slug = faker.helpers.slugify(faker.commerce.productName());
    const { number, title } = await factory.attrs<IVolume>('Product', { slug });

    const next = number + 1;
    expect(
      updateCatalog(
        {
          [slug]: number,
        },
        [{ title, number: next, slug }]
      )
    ).toStrictEqual({
      [slug]: next,
    });
  });
});
