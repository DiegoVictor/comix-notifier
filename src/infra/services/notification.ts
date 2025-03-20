import { SNS } from '@aws-sdk/client-sns';

const sns = new SNS({
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT_URL ?? undefined,
});

export const send = async (title: string, body: string) => {
  await sns.publish({
    Message: JSON.stringify({
      default: `${title}: ${body}`,
      GCM: JSON.stringify({
        notification: {
          title,
          body,
        },
      }),
    }),
    MessageStructure: 'json',
    TopicArn: process.env.TOPIC_ARN,
  });
};

const createEndpoint = async (Token: string) =>
  sns
    .createPlatformEndpoint({
      PlatformApplicationArn: process.env.PLATFORM_APPLICATION_ARN,
      Token,
    })
    .then(({ EndpointArn }) => EndpointArn);

export const subscribe = async (Token: string) => {
  const Endpoint = await createEndpoint(Token);
  await sns.subscribe({
    TopicArn: process.env.TOPIC_ARN,
    Protocol: 'application',
    Endpoint,
    ReturnSubscriptionArn: true,
  });
};
