const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const SubscriptionSchema = new Schema({
  userId: {
    type: ObjectId,
    required: true,
    index: 1
  },
  type: {
    type: String,
    enum: ['spider_service', 'tag'],
    required: true,
  },
  sourceId: {
    type: ObjectId,
    required: true,
  },
});

const SubscriptionModel = mongoose.model('subscription', SubscriptionSchema);

async function list(params) {
  const match = {};
  const flow = SubscriptionModel.find(match);
  const subs = await flow.exec();
  return subs;
};

async function insert(userId, url) {
  const sub = await SubscriptionModel.create({userId, url});
  return sub;
};

async function findByUserId(userId) {
  const sub = await SubscriptionModel.find({userId});
  return sub;
};

async function upsert(sub) {
  const upserted = await SubscriptionModel.findOneAndUpdate(sub, sub, {
    new: true,
    upsert: true,
  });
  return upserted;
};


module.exports = {
  SubscriptionModel,
  list,
  insert,
  findByUserId,
  upsert
};