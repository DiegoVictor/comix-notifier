import * as notificationService from '@infra/services/notification';
import { IVolume } from '@application/contracts/IVolume';

export const sendVolumesNotifications = (volumes: IVolume[]) =>
  Promise.all(
    volumes.map(({ title, number }) =>
      notificationService.send(
        `${title} #${number}`,
        `Novo volume disponível na Comix Book Shop`
      )
    )
  );
