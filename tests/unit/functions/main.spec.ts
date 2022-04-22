import { IConfig } from '@application/contracts/IConfig';
import { IVolume } from '@application/contracts/IVolume';
import { main } from '@functions/main/handler';
import factory from '../../utils/factory';

const mockGetConfigs = jest.fn();
jest.mock('@application/use_cases/getConfigs', () => ({
  getConfigs: () => mockGetConfigs(),
}));

const mockGetLastVolumesFromURLs = jest.fn();
jest.mock('@application/use_cases/getLastVolumesFromURLs', () => ({
  getLastVolumesFromURLs: (urls: string[]) => mockGetLastVolumesFromURLs(urls),
}));

const mockGetOnlyNewVolumes = jest.fn();
jest.mock('@application/use_cases/getOnlyNewVolumes', () => ({
  getOnlyNewVolumes: (volumes: IVolume[], catalog: Record<string, number>) =>
    mockGetOnlyNewVolumes(volumes, catalog),
}));

const mockUpdateCatalog = jest.fn();
jest.mock('@application/use_cases/updateCatalog', () => ({
  updateCatalog: (catalog: Record<string, number>, volumes: IVolume[]) =>
    mockUpdateCatalog(catalog, volumes),
}));

const mockSendVolumesNotifications = jest.fn();
jest.mock('@application/use_cases/sendVolumesNotifications', () => ({
  sendVolumesNotifications: (volumes: IVolume[]) =>
    mockSendVolumesNotifications(volumes),
}));

const mockUpdateConfigById = jest.fn();
jest.mock('@application/use_cases/updateConfigById', () => ({
  updateConfigById: (id: string, value: Record<string, any>) =>
    mockUpdateConfigById(id, value),
}));

describe('main', () => {
  it('should be able to send notifications for new volumes and update the catalog', async () => {
    const [urls, catalog] = await factory.attrsMany<
      IConfig<Record<string, any>>
    >('Config', 2);
    const volume = await factory.attrs<IVolume>('Product');

    mockGetConfigs.mockResolvedValueOnce([urls, catalog]);
    mockGetLastVolumesFromURLs.mockResolvedValueOnce([volume]);
    mockGetOnlyNewVolumes.mockResolvedValueOnce([volume]);

    const updatedCatalog = {
      [volume.slug]: volume.number,
    };
    mockUpdateCatalog.mockReturnValueOnce(updatedCatalog);
    mockSendVolumesNotifications.mockResolvedValueOnce({});

    await main();

    expect(mockGetConfigs).toHaveBeenCalled();
    expect(mockGetLastVolumesFromURLs).toHaveBeenCalledWith(urls.value);
    expect(mockGetOnlyNewVolumes).toHaveBeenCalledWith([volume], catalog.value);
    expect(mockUpdateCatalog).toHaveBeenCalledWith(catalog.value, [volume]);
    expect(mockSendVolumesNotifications).toHaveBeenCalledWith([volume]);
    expect(mockUpdateConfigById).toHaveBeenCalledWith(
      catalog.id,
      updatedCatalog
    );
  });

  it('should be able to log errors', async () => {
    const error = new Error('Test Error');
    mockGetConfigs.mockRejectedValueOnce(error);

    const log = jest.spyOn(console, 'log');
    log.mockImplementationOnce(() => {});

    await main();

    expect(mockGetConfigs).toHaveBeenCalled();
    expect(mockGetLastVolumesFromURLs).not.toHaveBeenCalled();
    expect(mockGetOnlyNewVolumes).not.toHaveBeenCalled();
    expect(mockUpdateCatalog).not.toHaveBeenCalled();
    expect(mockSendVolumesNotifications).not.toHaveBeenCalled();
    expect(mockUpdateConfigById).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(error);
  });
});
