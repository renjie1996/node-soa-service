const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const adminRouter = require('./admin');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/user', usersRouter);

router.use('/admin', adminRouter);

module.exports = router;


