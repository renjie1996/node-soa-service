const assert = require('assert');
const ElasticSearch = require('elasticsearch');
const log = console.log.bind(console);
let es = null;

const INDEX = 'es_test_index';
const TYPE = 'es_test_type';


describe('ES tests', async () => {
  /** init */
  before('connect to elasticsearch service', async () => {
    es = new ElasticSearch.Client({
      host: 'localhost:9200'
    });
    await es.ping();
  });
  /** 测试数据 */
  const doc = {
    name: '小鸡',
    hobbies: ['钱', '化妆品'],
    age: 22
  };

  /**
   * 创建字段
   */
  it('should create a doc on create command', async () => {
    await es.create({
      index: INDEX,
      type: TYPE,
      id: 1,
      body: doc
    });

    await new Promise(rsv => setTimeout(rsv, 1000)); // 索引，空间换时间,建立索引需要一个微小时间差
    const res = await es.search({
      index: INDEX,
      body: {
        query: {
          match: {
            hobbies: '钱'
          }
        }
      }
    });
    log('测试搜索的结果', res);
  })

  /**
   * 创建字段
   */
  it('should update a doc on command', async () => {
    const _doc = { name: '小鸡',age: 22, hobbies: ['工作', '成熟'] }
    const res = await es.update({
      index: INDEX,
      type: TYPE,
      id: 1,
      body: { doc: _doc }
    });
    log('测试修改的结果', res);
  })

  /**
   * 结束后删除
   */
  after('clear all data', async () => {
    await es.indices.delete({ index: INDEX });
  })

});