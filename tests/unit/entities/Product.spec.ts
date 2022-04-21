import { IProduct } from '@application/contracts/IProduct';
import { create } from '@entities/Product';
import factory from '../../utils/factory';

describe('Product.create', () => {
  it('should be able to create a product instance', async () => {
    const { title, number, slug } = await factory.attrs<IProduct>('Product');

    expect(
      create({
        slug,
        product: `<div class="product-name"><a href="${slug}" title="${title}">${title}, Volume ${number}</a>`,
      })
    ).toStrictEqual({
      title,
      number,
      slug,
    });
  });
});
