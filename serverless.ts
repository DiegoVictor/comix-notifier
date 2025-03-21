import type { AWS } from '@serverless/typescript';

import ComixNotifierMain from '@functions/main';
import ComixNotifierSubscribe from '@functions/subscribe';

const serverlessConfiguration: AWS = {
  service: 'comix-notifier',
  configValidationMode: 'error',
  frameworkVersion: '3',
  custom: {
    configTableName: 'ComixNotifierConfigs',
    executionInterval: '1 day',
    platformApplicationArn:
      'arn:aws:sns:${self:provider.region}:${aws:accountId}:app/GCM/Comix-Notifier',
  },
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Scan',
              'dynamodb:PutItem',
              'dynamoDB:UpdateItem',
            ],
            Resource: {
              'Fn::GetAtt': ['ComixNotifierConfigTable', 'Arn'],
            },
          },
          {
            Effect: 'Allow',
            Action: [
              'sns:Publish',
              'sns:CreatePlatformEndpoint',
              'sns:Subscribe',
            ],
            Resource: {
              Ref: 'ComixNotifierTopic',
            },
          },
          {
            Effect: 'Allow',
            Action: ['sns:CreatePlatformEndpoint'],
            Resource: '${self:custom.platformApplicationArn}',
          },
        ],
      },
    },
  },
  functions: {
    ComixNotifierMain,
    ComixNotifierSubscribe,
  },
  package: { individually: true },
  resources: {
    Resources: {
      ComixNotifierTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'ComixNotifierTopic',
        },
      },
      ComixNotifierConfigTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:custom.configTableName}',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
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
  layers: {
    Nodejs: {
      path: 'layers/nodejs',
      compatibleRuntimes: ['nodejs20.x'],
    },
  },
};

module.exports = serverlessConfiguration;
