const Spider = require('../model/mongoose/spider');
const ParamError = require('../error/httpBaseError/http_request_error');
const axios = require('axios');
const logger = require('../utils/loggers/logger');
const HttpBaseError = require('../error/httpBaseError/http_base_error');
const Content = require('../model/mongoose/content');

async function registerService (spider) {
  console.log(spider)
  const validations = {
    name: name => {
      if(!name) throw new ParamError('name', '名字不能为空！', 'a spider name is not empty');
      return;
    },
    validationUrl: url => {
      if(!url) throw new ParamError('url', 'URL不能为空！', 'a spider url is not empty');
      if(url.indexOf('http') === -1) throw new ParamError('url', 'URL非法！', 'a spider url must be regular');
      return;
    }
  };

  const keys = Object.keys(validations);
  for(let i = 0; i < keys.length; i++) {
    const k = keys[i];
    validations[k](spider[k]);
  };
  const res = await axios.get(spider.validationUrl).catch(e => {
    logger.error('error validation service on provided url', {
      err: e.stack || e
    });
    throw new HttpBaseError(400, '服务验证失败，请检查爬虫服务是否可用', 40000200, 'error validation service on provided url');
  });
  if(res && res.data) {
    const spiderServiceResponseValidation = {
      code: code => {
        if(code !== 0) {
          throw new HttpBaseError(400, `爬虫服务返回状态码：${code}`, 40000201, 'error validation service on provided code');
        }
      },
      protocol: protocol => {
        if(!protocol) {
          throw new HttpBaseError(400, `协议错误，空的协议`, 40000202, 'error validation service on provided protocol');
        }
        if('0.1' !== protocol.version) {
          throw new HttpBaseError(400, `协议版本错误: ${protocol.version}`, 40000203, 'error validation service on provided protocol');
        }
      },
      config: config => {
        if(!config || !config.contentList ) {
          throw new HttpBaseError(400, `配置内容错误`, 40000204, 'error validation service on provided protocol');
        }
      }
    };
    const keys = Object.keys(spiderServiceResponseValidation);
    for(let i = 0; i < keys.length; i++) {
      const k = keys[i];
      spiderServiceResponseValidation[k](res.data[k]);
    }
  }

  spider.contentList = res.data.config.contentList;
  spider.singleContent = res.data.config.singleContent;
  const createdSpider = await Spider.registerSpider(spider);
  return createdSpider;
};

async function startFetchingProcess (spider) {
  const { contentList } = spider;
  let { latestId } = spider;
  const { url, fequencyLimit, pageSizeLimit } = contentList;

  const actualPeriodMills = Math.ceil(1000 / fequencyLimit) * 2;

  let intervalId = setInterval(async () => {
    try {
      const contentList = await fetchingList(url, latestId, pageSizeLimit);
      if(!contentList || contentList.length === 0) return; 
      const wrappedList = contentList.map(c => ({
        spiderServiceId: spider._id,
        spiderServiceContentId: c.contentId,
        contentType: c.contentType,
        content: c.content,
        tags: c.tags,
        title: c.title,
      }));
      await Content.model.insertMany(wrappedList);
      latestId = wrappedList[wrappedList.length - 1].spiderServiceContentId;
      if(wrappedList.length < pageSizeLimit) {
        console.log('clear')
        clearInterval(intervalId);
      }
      console.log(wrappedList.length, pageSizeLimit, actualPeriodMills, fequencyLimit, latestId)
    } catch(e) {
      logger.error('list to mongo error', {
        errMsg: e.message,
        errStack: e.stack
      })
    }
    
  }, actualPeriodMills);
};

async function fetchingList (url, latestId, pageSize) {
  const contentList = await axios.get(url, { params: { latestId, pageSize } })
    .then(r => {
      if(!r||!r.data.contentList) throw new Error('爬虫服务没有响应');
      return r.data.contentList;
    })
    .catch(e => logger.error('fetch error', {
      errMsg: e.message,
      errStack: e.stack
    }));
  return contentList;
};

// 如果spiders的量上去了，这里启动会非常慢
async function initSpiders() {
  // const spiders = await Spider.model.find({ status: 'validated' });
  const spiders = await Spider.model.find({});
  for (let i = 0; i < spiders.length; i++) {
    const spider = spiders[i];
    startFetchingProcess(spider)
      .catch((e) => {
        logger.error(
          `error starting fetching process on spider ${spider._id}`,
          {
            errMsg: e.message,
            errStack: e.stack,
          },
        );
      });
  }
}

// initSpiders()
//   .catch((e) => {
//     logger.error(
//       'error initializing spider processes',
//       {
//         errMsg: e.message,
//         errStack: e.stack,
//       },
//     );
//   });




module.exports = {
  registerService,
  initSpiders
};