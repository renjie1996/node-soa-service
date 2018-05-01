// const User = require('../model/mongoose/user');
// const Subscription = require('../model/mongoose/subscription');

// module.exports.createSubscription = async function(userId, url) {
//   const user = await User.getOneById(userId);
//   if(!user) throw new Error('No such user！');
//   const sub = await Subscription.insert(userId, url);
//   return sub;
// }
const Subscription = require('../model/mongoose/subscription');
const Content = require('../model/mongoose/content');

async function createSubscription(userId, subscriptionType, sourceId) {
  const createdSub = await Subscription.upsert({
    userId,
    type: subscriptionType,
    sourceId,
  });
  return createdSub;
}

async function getSpiderServiceContents(query = { page: 0, pageSize: 10 }) {
  console.log(query)
  const subs = await Subscription.SubscriptionModel.find({
    userId: query.userId,
    type: 'spider_service',
  }, {
    _id: 0,
    sourceId: 1,
  });
  console.log('123', subs)
  const spiderServiceIds = subs.map(s => s.sourceId);
  const flow = Content.model.find({
    spiderServiceId: { $in: spiderServiceIds },
  });

  flow.skip(query.page * query.pageSize);
  flow.limit(query.pageSize);

  flow.sort({ _id: -1 });

  const contents = await flow.exec();
  return contents;
}

module.exports = {
  createSubscription,
  getSpiderServiceContents,
};