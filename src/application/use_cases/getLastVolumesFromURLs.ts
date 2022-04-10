import * as Product from "@entities/Product";

export const getSlugFromURL = (url: string) =>
  url.replace(/http:\/\/www\.comix\.com\.br\/mangas\/\w\/(.+)\.html/, "$1");

const getVolumesFromPage = ({ data: text, url }) => {
  const products: string[] = text.match(Product.PRODUCT_NAME_REGEX);
  const slug = getSlugFromURL(url);

  return products
    .map((product) => Product.create({ product, slug }))
    .filter(({ number }) => !isNaN(number));
};
