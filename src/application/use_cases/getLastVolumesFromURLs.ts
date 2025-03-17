import { getPage } from '@infra/services/comix';
import * as Product from '@entities/Product';
import * as Volume from '@entities/Volume';
import { IProduct } from '@application/contracts/IProduct';

export const getSlugFromURL = (url: string) =>
  url.replace(/https:\/\/www\.comix\.com\.br\/mangas\/\w\/(.+)\.html/, '$1');

const getVolumesFromPage = ({ data: text, url }) => {
  const products: string[] = text.match(Product.PRODUCT_NAME_REGEX);
  const slug = getSlugFromURL(url);

  return products
    .map((product) => Product.create({ product, slug }))
    .filter(({ number }) => !Number.isNaN(number));
};

const getLastVolume = (products: IProduct[]) =>
  Volume.create(
    products.reduce(
      (previous, product) =>
        !previous || product.number > previous.number ? product : previous,
      null,
    ),
  );

export const getLastVolumesFromURLs = async (urls: string[]) =>
  Promise.all(
    urls.map((url) =>
      getPage(url).then(getVolumesFromPage).then(getLastVolume),
    ),
  );
