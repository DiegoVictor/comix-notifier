import { IVolume } from '@application/contracts/IVolume';
import { getOnlyNewVolumes } from '@application/use_cases/getOnlyNewVolumes';
import factory from '../../utils/factory';

describe('getOnlyNewVolumes', () => {
  it('should be able to filter and return only the new volumes', async () => {
    const [old, brandNew] = await factory.attrsMany<IVolume>('Product', 2);

    expect(
      getOnlyNewVolumes([old, brandNew], {
        [old.slug]: old.number,
      })
    ).toStrictEqual([brandNew]);
  });
});
