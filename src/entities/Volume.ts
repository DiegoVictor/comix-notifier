import { IVolume } from "@application/contracts/IVolume";

export const create = ({
  title,
  slug,
  number,
}: Record<string, any>): IVolume => ({
  title,
  slug,
  number,
});
