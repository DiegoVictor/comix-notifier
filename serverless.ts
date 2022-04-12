import type { AWS } from "@serverless/typescript";

import ComixNotifierMain from "@functions/main";

const serverlessConfiguration: AWS = {
  service: "comix-notifier",
  configValidationMode: "error",
  frameworkVersion: "3",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
    configTable: "comix-notifier-configs",
    fallbackMangaUrl: "http://www.comix.com.br/mangas/a/ataque-dos-titas.html",
  },
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:Scan",
              "dynamodb:PutItem",
              "dynamoDB:UpdateItem",
            ],
            Resource: {
              "Fn::GetAtt": ["ComixNotifierConfigTable", "Arn"],
            },
          },
          {
            Effect: "Allow",
            Action: ["sns:Publish"],
            Resource: {
              Ref: "ComixNotifierTopic",
            },
          },
        ],
      },
    },
  },
  functions: {
    ComixNotifierMain,
  },
  resources: {
    Resources: {
      ComixNotifierTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "ComixNotifierTopic",
        },
      },
      ComixNotifierConfigTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:custom.configTable}",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
