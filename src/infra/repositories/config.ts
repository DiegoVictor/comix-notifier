import { IConfig } from "@application/contracts/IConfig";
import { DynamoDB, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import * as Config from "@entities/Config";

const dynamodb = new DynamoDB({ region: process.env.REGION });

const getFirstItem = (result: ScanCommandOutput) =>
  unmarshall(result.Items.shift());

export const getOneByName = async <T>(name: string) =>
  dynamodb
    .scan({
      TableName: process.env.CONFIG_TABLE,
      ScanFilter: {
        name: {
          ComparisonOperator: "EQ",
          AttributeValueList: [
            {
              S: name,
            },
          ],
        },
      },
    })
    .then((result) => {
      if (result.Count > 0) {
        return Config.create<T>(getFirstItem(result));
      }

      return null;
    });

export const createOne = async <T>(config: IConfig<T>) =>
  dynamodb
    .putItem({
      TableName: process.env.CONFIG_TABLE,
      Item: marshall(config),
    })
    .then(() => config);

export const updateOneById = async <T>(id: string, value: T) => {
  await dynamodb.updateItem({
    TableName: process.env.CONFIG_TABLE,
    Key: marshall({ id }),
    UpdateExpression: "set #value = :catalog",
    ExpressionAttributeValues: marshall({ ":catalog": value }),
    ExpressionAttributeNames: { "#value": "value" },
  });
};
