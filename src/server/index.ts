import 'reflect-metadata';
import http from 'http';
import { createConnection } from 'typeorm';
import Message from '../models/database/slack/Message';
import { argv } from 'yargs';
import log from '../log';
import { URL } from '../constants';
import config from '../config';

import app from './app';

const server = http.createServer(app);
(async () => {

  log.info(process.env, 'Server starting up...');

  if (argv.pms) {
    log.info(`Using PMS at ${argv.pms}`);
  } else {
    log.warn('No PMS configured');
  }

  // let database = ':memory:';

  // const configPath = argv.config;
  // if (configPath) {
  //   database = `${configPath}/plexbuddy.db`;
  //   log.info(`Using database at ${database}`);
  // } else {
  //   log.warn(`Using in memory database`);
  // }

  // const connection = await createConnection({
  //   type: 'sqlite',
  //   database,
  //   entities: [Message],
  //   synchronize: true
  // });

  process.on('exit', () => {
    log.info('Server shutting down...');
    server.close();
    log.flush();
    // connection.close();
  });

  server.listen(8000, () => log.info(`Server listening at ${URL()}`));
})();

export default server;
