import { IVolume } from '@application/contracts/IVolume';
import { sendVolumesNotifications } from '@application/use_cases/sendVolumesNotifications';
import factory from '../../utils/factory';

const mockSend = jest.fn();
jest.mock('@infra/services/notification', () => ({
  send: (title: string, body: string) => mockSend(title, body),
}));

describe('sendVolumesNotifications', () => {
  it('should be able to send notification for every new volume', async () => {
    const volumes = await factory.attrsMany<IVolume>('Product', 3);
    mockSend.mockResolvedValue(true);

    await sendVolumesNotifications(volumes);

    volumes.forEach(({ title, number }) => {
      expect(mockSend).toHaveBeenCalledWith(
        `${title} #${number}`,
        `Novo volume disponível na Comix Book Shop`
      );
    });
  });
});
