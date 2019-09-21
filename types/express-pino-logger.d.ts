declare module 'express-pino-logger' {

  import { Handler } from 'express';
  import { DestinationStream, LoggerOptions as LoggerOptionsBase, Logger } from 'pino';

  interface LoggerOptions extends LoggerOptionsBase {
    genReqId: () => string
  }

  function expressPinoLogger(optionsOrStream?: LoggerOptions | DestinationStream | { logger: Logger }): Handler;

  function expressPinoLogger(options: LoggerOptions, stream: DestinationStream): Handler;

  export = expressPinoLogger;
}
