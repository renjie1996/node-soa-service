const { Client } = require('elasticsearch');
const Content = require('../model/mongoose/content');
const es = new Client({
  host: "localhost:9200",
  // log: "trace" // 追踪日志
});

const CONTENT_INDEX = 'node-soa';
const CONTENT_TYPE = 'content';

function normalizeTagScores(tags) {
  const totalScore = tags.reduce((p, n) => {
    return p + n.score;
  }, 0);
  return tags.map((t) => {
    const newTag = Object.assign({}, t);
    newTag.score /= totalScore;
    return newTag;
  });
}

async function createOrUpdateContent(content) {
  const doc = {
    title: content.title,
    tags: normalizeTagScores(content.tags),
    serviceId: content.spiderServiceId,
  };

  await es.update({
    index: CONTENT_INDEX,
    type: CONTENT_TYPE,
    id: content._id.toString(),
    body: {
      doc,
      upsert: doc,
    },
  });
}

async function createOrUpdateContents(contents) {
  const ps = [];
  for (const content of contents) {
    const cToInsert = content.toObject && content.toObject();
    ps.push(createOrUpdateContent(cToInsert));
  }
  await Promise.all(ps);
}

async function searchByTag(query = { tag: '', page: 0, pageSize: 10 }) {
  const r = await es.search({
    index: CONTENT_INDEX,
    type: CONTENT_TYPE,
    body: {
      from: query.page * query.pageSize,
      size: query.pageSize,
      query: {
        bool: {
          disable_coord: true,
          should: [
            {
              nested: {
                path: 'tags',
                query: {
                  function_score: {
                    functions: [
                      {
                        field_value_factor: {
                          field: 'tags.score',
                          missing: 0,
                        },
                      },
                    ],
                    query: {
                      match: {
                        'tags.value': query.tag,
                      },
                    },
                    score_mode: 'sum',
                    boost_mode: 'multiply',
                  },
                },
                score_mode: 'sum',
              },
            },
          ],
        },
      },
    },
  })
  const { hits } = r.hits;
  const ids = hits.map(h => h._id);

  const contents = await Content.model.find({ _id: { $in: ids } });

  contents.sort(
    (a, b) => hits.findIndex((h) => h._id.toString() === a._id.toString()) -
    hits.findIndex((h) => h._id.toString() === b._id.toString()));
  return r;
}


module.exports = {
  createOrUpdateContent,
  createOrUpdateContents,
  es,
  searchByTag,
}