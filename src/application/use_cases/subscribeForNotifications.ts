import * as notificationService from "@infra/services/notification";

export const subscribeForNotifications = async (token: string) =>
  notificationService.subscribe(token);
