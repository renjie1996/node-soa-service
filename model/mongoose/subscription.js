const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const SubscriptionSchema = new Schema({
  userId: {
    type: ObjectId,
    required: true,
    index: 1
  },
  url: {
    type: String,
    required: true
  }
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

module.exports = {
  list,
  insert,
  findByUserId
};