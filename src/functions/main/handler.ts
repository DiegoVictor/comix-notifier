import { updateCatalog } from "@application/use_cases/updateCatalog";
import { getLastVolumesFromURLs } from "@application/use_cases/getLastVolumesFromURLs";
import { getOnlyNewVolumes } from "@application/use_cases/getOnlyNewVolumes";
import { getConfigs } from "@application/use_cases/getConfigs";

export const main = async () => {
  try {
    const [{ value: urls }, { id, value: catalog }] = await getConfigs();

    const volumes = await getLastVolumesFromURLs(urls).then((lastVolumes) =>
      getOnlyNewVolumes(lastVolumes, catalog)
    );

    if (volumes.length > 0) {
      const updatedCatalog = updateCatalog(catalog, volumes);
    }
  } catch (err) {
    console.log(err);
  }
};
