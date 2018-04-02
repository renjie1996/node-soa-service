const path = require('path')
const winston = require('winston')
require('winston-daily-rotate-file')
const { Logger, transports } = winston
const { Console, DailyRotateFile } = transports

const logger = new Logger({
  transports: [
    new Console(),
    new DailyRotateFile({
      name: 'error_log',
      filename: `${__dirname}/logs/.error_log.log`,
      datePattern: 'yyyy-MM-dd',
      prepend: true, // rotate生成在前面
      level: 'error'
    }),
    // new DailyRotateFile({
    //   name: 'base_log',
    //   filename: `${__dirname}/logs/info_log.log`,
    //   datePattern: 'yyyy-MM-dd',
    //   prepend: true, // rotate生成在前面
    //   level: 'info'
    // }),

  ]
})

module.exports = logger