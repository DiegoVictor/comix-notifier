import { handlerPath } from "@utils/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    TOPIC_ARN: {
      Ref: "ComixNotifierTopic",
    },
    CONFIG_TABLE: "${self:custom.configTable}",
    FALLBACK_MANGA_URL: "${self:custom.fallbackMangaUrl}",
  },
  events: [
    {
      eventBridge: {
        schedule: "rate(${self:custom.executionInterval})",
      },
    },
  ],
};
