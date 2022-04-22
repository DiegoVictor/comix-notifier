import { updateCatalog } from '@application/use_cases/updateCatalog';
import { getLastVolumesFromURLs } from '@application/use_cases/getLastVolumesFromURLs';
import { getOnlyNewVolumes } from '@application/use_cases/getOnlyNewVolumes';
import { sendVolumesNotifications } from '@application/use_cases/sendVolumesNotifications';
import { updateConfigById } from '@application/use_cases/updateConfigById';
import { getConfigs } from '@application/use_cases/getConfigs';

export const main = async () => {
  try {
    const [{ value: urls }, { id, value: catalog }] = await getConfigs();

    const volumes = await getLastVolumesFromURLs(urls).then((lastVolumes) =>
      getOnlyNewVolumes(lastVolumes, catalog)
    );

    if (volumes.length > 0) {
      const updatedCatalog = updateCatalog(catalog, volumes);

      await sendVolumesNotifications(volumes).then(() =>
        updateConfigById(id, updatedCatalog)
      );
    }

    return {
      statusCode: 204,
      body: '',
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
