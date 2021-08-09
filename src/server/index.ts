import 'reflect-metadata';
import http from 'http';
import log from '../log';
import { URL } from '../constants';

import app from './app';

const server = http.createServer(app);
(async () => {

  log.info(process.env, 'Server starting up...');

  process.on('SIGINT', () => process.exit());
  process.on('SIGTERM', () => process.exit(0));
  process.on('exit', () => {
    log.info('Server shutting down...');
    server.close();
    log.flush();
  });

  server.listen(8000, () => log.info(`Server listening at ${URL()}`));
})();

export default server;
