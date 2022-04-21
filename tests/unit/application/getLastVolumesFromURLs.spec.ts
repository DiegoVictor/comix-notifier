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
    /<\w+\sclass="product-name"><a\shref="[0-9a-zA-Z,\-:/.]+"\stitle="[0-9a-zA-Z ]+">([0-9a-zA-Z, ]+)<\/a>/gi,
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
    const url = `http://www.comix.com.br/mangas/a/${slug}.html`;
    const products = [
      `<h2 class="product-name"><a href="http://www.comix.com.br/${slug}-${previous}" title="${title} ${previous}">${title}, Volume ${previous}</a>`,
      `<h2 class="product-name"><a href="http://www.comix.com.br/${slug}-${next}" title="${title} ${next}">${title}, Volume ${next}</a>`,
      `<h2 class="product-name"><a href="http://www.comix.com.br/${slug}-${current}" title="${title} ${current}">${title}, Volume ${current}</a>`,
    ];

    mockProductCreate.mockReturnValueOnce({ title, number: previous, slug });
    mockProductCreate.mockReturnValueOnce({ title, number: next, slug });
    mockProductCreate.mockReturnValueOnce({ title, number: current, slug });
    mockGetPage.mockResolvedValueOnce({
      url,
      data: products.join(''),
    });

    await getLastVolumesFromURLs([url]);

    expect(mockGetPage).toHaveBeenCalledWith(url);
    products.forEach((product) => {
      expect(mockProductCreate).toHaveBeenCalledWith({ slug, product });
    });
    expect(mockVolumeCreate).toHaveBeenCalledWith({
      title,
      number: next,
      slug,
    });
  });
});
