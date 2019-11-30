import 'reflect-metadata';
import http from 'http';
import { createConnection } from 'typeorm';
import Message from '../models/database/slack/Message';
import { argv } from 'yargs';
import log from '../log';
import { URL } from '../constants';

import app from './app';

const server = http.createServer(app);
(async () => {

  log.info(process.env, 'Server starting up...');

  if (argv.pms) {
    log.info(`Using PMS at ${argv.pms}`);
  } else {
    log.warn('No PMS configured');
  }

  let database = ':memory:';

  const configPath = argv.config;
  if (configPath) {
    database = `${configPath}/plexbuddy.db`;
    log.info(`Using database at ${database}`);
  } else {
    log.warn(`Using in memory database`);
  }

  const connection = await createConnection({
    type: 'sqlite',
    database,
    entities: [Message],
    synchronize: true
  });

  process.on('SIGINT', () => process.exit());
  process.on('SIGTERM', () => process.exit(0));
  process.on('exit', () => {
    log.info('Shutting down...');
    server.close();
    connection.close();
  });

  server.listen(8000, () => log.info(`Listening at ${URL()}`));
})();

export default server;
