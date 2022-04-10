import { getConfigs } from "@application/use_cases/getConfigs";

export const main = async () => {
  try {
    const [{ value: urls }, { id, value: catalog }] = await getConfigs();
  } catch (err) {
    console.log(err);
  }
};
