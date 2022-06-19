import { handlerPath } from '@utils/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.subscribe`,
  environment: {
    TOPIC_ARN: {
      Ref: 'ComixNotifierTopic',
    },
    PLATFORM_APPLICATION_ARN: '${self:custom.platformApplicationArn}',
  },
  name: 'ComixNotifierSubscribe',
  events: [
    {
      http: {
        path: '/subscribe',
        method: 'POST',
        private: true,
      },
    },
  ],
  layers: [{ Ref: 'NodejsLambdaLayer' }],
};
