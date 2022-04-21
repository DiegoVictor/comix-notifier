import { IVolume } from '@application/contracts/IVolume';
import { create } from '@entities/Volume';
import factory from '../../utils/factory';

describe('Volume.create', () => {
  it('should be able to create a config instance', async () => {
    const { title, number, slug } = await factory.attrs<IVolume>('Product');

    expect(create({ title, number, slug })).toStrictEqual({
      title,
      number,
      slug,
    });
  });
});
