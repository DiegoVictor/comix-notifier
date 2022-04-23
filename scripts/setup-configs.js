const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { randomUUID } = require('crypto');

const dynamodb = new DynamoDB({});

dynamodb.batchWriteItem({
  RequestItems: {
    ComixNotifierConfigs: [
      {
        PutRequest: {
          Item: marshall({
            id: randomUUID(),
            name: 'catalog',
            value: {},
          }),
        },
      },
      {
        PutRequest: {
          Item: marshall({
            id: randomUUID(),
            name: 'urls',
            value: [
              'http://www.comix.com.br/mangas/g/golden-kamuy.html',
              'http://www.comix.com.br/mangas/m/made-in-abyss.html',
              'http://www.comix.com.br/mangas/m/my-hero-academia.html',
              'http://www.comix.com.br/mangas/n/noragami.html',
              'http://www.comix.com.br/mangas/o/one-punch-man.html',
              'http://www.comix.com.br/mangas/s/seraph-of-the-end.html',
              'http://www.comix.com.br/mangas/t/takagi.html',
              'http://www.comix.com.br/mangas/t/tanya-the-evil.html',
            ],
          }),
        },
      },
    ],
  },
});
