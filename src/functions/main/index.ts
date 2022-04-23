import { handlerPath } from '@utils/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    TOPIC_ARN: {
      Ref: 'ComixNotifierTopic',
    },
    CONFIG_TABLE: {
      'Fn::GetAtt': ['ComixNotifierConfigTable', 'Arn'],
    },
    FALLBACK_MANGA_URL: '${self:custom.fallbackMangaUrl}',
  },
  name: 'ComixNotifierMain',
  events: [
    {
      eventBridge: {
        schedule: 'rate(${self:custom.executionInterval})',
      },
    },
  ],
};
