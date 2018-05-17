const es = require('../services/elasticSearch');
require('../services/mongoose.connection');

es.searchByTag({
  tag: '数码',
  page: 0,
  pageSize: 10
}).then(r => {
  // console.log(JSON.stringify(r))
  r.hits.hits.forEach(h => console.log(h._source));
})