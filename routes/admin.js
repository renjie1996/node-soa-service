const express = require('express');
const router = express.Router();
const SpiderService = require('../services/spider');
const logger = require('../utils/loggers/logger');
const apiRes = require('../utils/response_format');

router.route('/spider').post(async (req, res, next) => {
  try {
    const spider = req.body;
    const createdSpider = await SpiderService.registerService(spider);
    res.data = {
      spider: createdSpider
    };
    apiRes(req, res);
  } catch (e) {
    logger.error(e);
    next(e);
  }
});


router.route('/sync').get(async (req, res, next) => {
  try {
    SpiderService.initSpiders()
      .catch((e) => {
        logger.error(
          'error initializing spider processes',
          {
            errMsg: e.message,
            errStack: e.stack,
          },
        );
      });
    res.json({
      code: 0,
      msg: '服务初始化成功'
    })

  } catch (e) {
    logger.error(e);
    next(e);
  }
});



module.exports = router;