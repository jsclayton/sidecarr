import 'reflect-metadata';
import http from 'http';
import { createConnection } from 'typeorm';
import Message from '../models/database/slack/Message';

import app from './app';

const server = http.createServer(app);
(async () => {

  await createConnection({
    type: 'sqlite',
    database: '/config/plexbuddy.db',
    entities: [Message],
    synchronize: true
  });

  server.listen(8000, () => {

    console.log('Listening at http://127.0.0.1:8000');
  });
})();

export default server;
