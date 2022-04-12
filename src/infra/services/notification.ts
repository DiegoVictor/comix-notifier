import { SNS } from "@aws-sdk/client-sns";

const sns = new SNS({ region: process.env.REGION });

export const send = async (title: string, body: string) => {
  await sns.publish({
    Message: JSON.stringify({
      default: "",
      GCM: JSON.stringify({
        notification: {
          title,
          body,
        },
      }),
    }),
    MessageStructure: "json",
    TopicArn: process.env.TOPIC_ARN,
  });
};
