const { es } = require('../services/elasticSearch');

async function initWhatILoveIndex() {
  await es.indices.create({
    index: 'node-soa',
  });
  await es.indices.putMapping({
    index: 'node-soa',
    type: 'content',
    body: {
      properties: {
        tags: {
          type: 'nested',
          properties: {
            score: {
              type: 'float',
            },
            value: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              },
            },
          },
        },
      },
    },
  });
}

switch (process.argv[2]) {
  case 'init':
    initWhatILoveIndex()
      .then(() => {
        console.log('done');
        process.exit(0);
      })
      .catch((e) => {
        console.log(e);
        process.exit(1);
      });
    break;
  default:
    process.exit(0);
    break;
}