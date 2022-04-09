import { DynamoDB, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

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
