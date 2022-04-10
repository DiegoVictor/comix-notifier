import { handlerPath } from "@utils/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    CONFIG_TABLE: "${self:custom.configTable}",
    FALLBACK_MANGA_URL: "${self:custom.fallbackMangaUrl}",
  },
};
