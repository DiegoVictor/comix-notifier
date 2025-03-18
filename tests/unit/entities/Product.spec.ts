import { IProduct } from '@application/contracts/IProduct';
import { create } from '@entities/Product';
import factory from '../../utils/factory';

describe('Product.create', () => {
  it('should be able to create a product instance', async () => {
    const { title, number, slug } = await factory.attrs<IProduct>('Product');

    expect(
      create({
        slug,
        product: `<strong class="product name product-item-name"><a class="product-item-link" href="${slug}">${title}, Volume ${number}</a></strong>`,
      }),
    ).toStrictEqual({
      title,
      number,
      slug,
    });
  });
});
