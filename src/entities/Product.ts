import { IProduct } from '@application/contracts/IProduct';

export const PRODUCT_NAME_REGEX =
  /<strong\sclass="product name product-item-name"><a\sclass="product-item-link"\shref=".+">(.+)<\/a><\/strong>/gi;

export const create = ({ slug, product }: Record<string, any>): IProduct => {
  const [title, ...parts] = product
    .replace(PRODUCT_NAME_REGEX, '$1')
    .split(/(volume|nº|Vol\.)/i)
    .map((text: string) => text.trim().replace(/,$/, ''));

  return { title, number: Number(parts.pop()), slug };
};
