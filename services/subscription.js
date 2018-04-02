const User = require('../model/mongoose/user');
const Subscription = require('../model/mongoose/subscription');

module.exports.createSubscription = async function(userId, url) {
  const user = await User.getOneById(userId);
  if(!user) throw new Error('No such user！');
  const sub = await Subscription.insert(userId, url);
  return sub;
}