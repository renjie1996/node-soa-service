const elasticsearch = require('elasticsearch');
const es = new elasticsearch.Client({
  host: "http://127.0.0.1:9200",
  // log: "trace" // 追踪日志
});

(async () => {
  const r = await es.search({
    index: 'whatever',
    body: {
      query: {
        match: {
          desc: '小鸡'
        }
      }
    }
  });
  console.log(r);
})()
  .catch(e => console.log(e))