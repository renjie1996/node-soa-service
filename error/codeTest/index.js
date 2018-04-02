const winston = require('winston')
require('winston-daily-rotate-file')
const { Logger, transports } = winston

const logger = new Logger({
  transports: [
    new (transports.File)({
      name: 'error_logger',
      filename: 'logs/error.log',
      level: 'error'
    }),
    new (transports.File)({
      name: 'info_logger',
      filename: 'logs/info.log',
      level: 'info'
    }),
    new transports.Console({
      level: 'error'
    }),
  ]
})

logger.info('my first log with winston')
logger.error('error warning')


const reqLogger = new Logger({
  transports: [
    // new transports.File({
    //   name: 'req_logger',
    //   filename: 'logs/req.log',
    //   level: 'info'
    // }),
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: './logs/.req_log.log',
      datePattern: 'yyyy_MM_dd',
      prepend: true, // rotate生成在前面
      level: 'info'
    })
  ]
})

reqLogger.info('request success!')

const err = new Error('Test')
reqLogger.info('paramTest', {
  other: {
    a: 1,
    b: 2,
    err: err.stack
  }
})


// elk日志系统，日志去哪

// 大体量数据- 访问速度、访问时间不敏感的数据，移放在外接磁盘和主系统无关，合适频率进行归档，封存，
// 并不关心很久之前的日志 
// logger rotation 日志滚动 - 以一个每天生成的日志，以当天的时间作为命名一部分进去
// 自己写脚本 或包 进行logger rotate