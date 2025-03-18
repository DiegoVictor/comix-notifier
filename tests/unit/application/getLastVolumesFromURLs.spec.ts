import { getLastVolumesFromURLs } from '@application/use_cases/getLastVolumesFromURLs';
import { IProduct } from '@application/contracts/IProduct';
import factory from '../../utils/factory';

const mockGetPage = jest.fn();
jest.mock('@infra/services/comix', () => ({
  getPage: (url: string) => mockGetPage(url),
}));

const mockProductCreate = jest.fn();
jest.mock('@entities/Product', () => ({
  create: (product: Record<string, any>) => mockProductCreate(product),
  PRODUCT_NAME_REGEX:
    /<\w+\sclass="product name product-item-name"><a\sclass="product-item-link"\shref="[0-9a-zA-Z,\-:/.]+">([0-9a-zA-Z, ]+)<\/a><\/strong>/gi,
}));

const mockVolumeCreate = jest.fn();
jest.mock('@entities/Volume', () => ({
  create: (volume: Record<string, any>) => mockVolumeCreate(volume),
}));

describe('getLastVolumesFromURLs', () => {
  it('should be able to get the last volume of a page', async () => {
    const previous = 1;
    const current = 2;
    const next = 3;
    const { title, slug } = await factory.attrs<IProduct>('Product');
    const url = `https://www.comix.com.br/mangas/a/${slug}.html`;
    const products = [
      `<strong class="product name product-item-name">
        <a class="product-item-link" href="https://www.comix.com.br/${slug}-${previous}">
          ${title}, Volume ${previous}
        </a>
      </strong>`,
      `<strong class="product name product-item-name">
        <a class="product-item-link" href="https://www.comix.com.br/${slug}-${next}">
          ${title}, Volume ${next}
        </a>
      </strong>`,
      `<strong class="product name product-item-name">
        <a class="product-item-link" href="https://www.comix.com.br/${slug}-${current}">
          ${title}, Volume ${current}
        </a>
      </strong>`,
    ];

    const BREAK_LINE_REGEX = /(\n|\s{2,})/gi;

    mockProductCreate.mockReturnValueOnce({ title, number: previous, slug });
    mockProductCreate.mockReturnValueOnce({ title, number: next, slug });
    mockProductCreate.mockReturnValueOnce({ title, number: current, slug });
    mockGetPage.mockResolvedValueOnce({
      url,
      data: products.join('').replace(BREAK_LINE_REGEX, ''),
    });

    await getLastVolumesFromURLs([url]);

    expect(mockGetPage).toHaveBeenCalledWith(url);
    products.forEach((product) => {
      expect(mockProductCreate).toHaveBeenCalledWith({
        slug,
        product: product.replace(BREAK_LINE_REGEX, ''),
      });
    });
    expect(mockVolumeCreate).toHaveBeenCalledWith({
      title,
      number: next,
      slug,
    });
  });
});
