const express = require('express');
const router = express.Router();
const userService = require('../services/user')
const subscriptionServer = require('../services/subscription')
const HttpReqParamsError = require('../error/httpBaseError/http_request_error')
const auth = require('../middleware/auth')
const apiRes = require('../utils/response_format');

/**
 * 1. koa 原生支持把路由回调写成async，但是express原生不支持，Error难以catch，需要每个做一次try catch
 * 2. 三方中间件不能串联。需要用函数包一下async（Promise）
 */

/* GET users listing. */
router.get('/', (req, res, next) => {
  (async () => {
    throw new HttpReqParamsError('page', '请指定页码', 'cannot not exist id')
    const users = await userService.getAllUsers()
    res.locals.users = users // 等于 res.render('user', {user})
    res.render('users')
  })()
    .then(() => {

    })
    .catch(e => {
      next(e)
    })
  
});



/* POST add users listing. */
router.post('/', async (req, res, next) => {
  const { username, password } = req.body
  // const { firstName, lastName, age } = req.body
  console.log('body', req.body)
  // const user = await userService.addNewUser({firstName, lastName, age})
  const user = await userService.addNewUser({ username, password})
  res.json(user)
});


router.get('/:userId', async (req, res) => {
  try {
    if(req.params.userId.length < 5) {
      (async () => {
        throw new HttpReqParamsError(
          'userId',
          '用户id不能为空',
          'user id is can not be empty!'
        )
      })().catch(e => {
        console.log(e)
        res.json(e)
      })
    }
    const user = await userService.getUserById(req.params.userId)
    res.locals.user = user
    res.render('user')
  } catch(e) {
    console.log(e)
    res.json(e)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const result = await userService.loginWithUsernameAndPass(username, password)
    res.json(result)
  } catch (e) {
    console.log(e)
    next(e)
  }
});


router.post('/:userId/subscription', auth(), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { subscriptionType, sourceId } = req.body;
    const sub = await subscriptionServer.createSubscription(
      userId,
      subscriptionType,
      sourceId,
    );
    res.json(sub)
  } catch (e) {
    console.log(e)
    next(e)
  }
})
// router.use(auth());

// router.post('/:userId/subscription', auth(), async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     const { subscriptionType, sourceId } = req.body;
//     const sub = await subscriptionServer.createSubscription(
//       userId,
//       subscriptionType,
//       sourceId,
//     );
//     res.data =  {
//       sub,
//     };
//     apiRes(req, res);
//   } catch(e) {
//     next(e);
//   }
// })

router.get('/:userId/subContent', auth(), (req, res, next) => {
  (async () => {
    const { userId } = req.params;
    let { page, pageSize } = req.query;
    page = Number(page) || 0;
    pageSize = Number(pageSize) || 10;

    const contents = await subscriptionServer.getSpiderServiceContents({
      userId,
      page,
      pageSize,
    });
    return {
      contents,
    };
  })()
    .then((r) => {
      res.data = r;
      apiRes(req, res);
    })
    .catch((e) => {
      next(e);
    });
});


module.exports = router;
