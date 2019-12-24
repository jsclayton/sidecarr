import config from './config';

export const URL = (path: string = '') => {
  return `${config.server.baseUrl}${path}`;
}
