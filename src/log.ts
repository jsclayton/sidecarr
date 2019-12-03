import pino from 'pino';

export default pino({
  level: process.env.NODE_ENV === 'production' ? 'debug' : 'trace'
});
