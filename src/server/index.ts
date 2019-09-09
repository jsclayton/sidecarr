import http from 'http';

import app from './app';

const server = http.createServer(app);
server.listen(8000, () => {

  console.log('Listening at http://127.0.0.1:8000');
});

export default server;
