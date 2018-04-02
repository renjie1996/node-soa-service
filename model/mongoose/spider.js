const mongoose = require('mongoose');
const logger = require('../../utils/loggers/logger');
const InternalServerError = require('../../error/httpBaseError/http_internal_error');

const { Schema } = mongoose;

const SpiderSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  validationUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: [
      'registered',
      'validated',
      'running', 
      'paused', 
      'stopped', 
      'up_to_date'
    ]
  },
  singleContent: {
    url: {
      type: String,
    },
    fequencyLimit: {
      type: Number,
    }
  },
  contentList: {
    url: {
      type: String,
    },
    pageSizeLimit: {
      type: Number,
      default: 10
    },
    fequencyLimit: {
      type: Number,
      default: 10
    },
    latestId: String
  }
});

const SpiderModel = mongoose.model('SpiderService', SpiderSchema);

async function registerSpider(spider) {
  const created = await SpiderModel.create(spider)
    .catch((e) => {
      logger.error(
        'error creating spider when trying to register a new one',
        {
          errMsg: e.message,
          errStack: e.stack,
        },
      );
      throw new InternalServerError('error creating spider service on mongoose');
    });
  return created;
}

async function updateSpiderMsg(spider, latestId) {
  const { _id } = spider
  spider["contentList"]["latestId"] = latestId;
  const updated = await SpiderModel.findOneAndUpdate(
    {  _id: _id }, 
    spider
  )
}


module.exports = {
  model: SpiderModel,
  registerSpider,
  updateSpiderMsg
};