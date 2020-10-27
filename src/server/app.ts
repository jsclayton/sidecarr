import { default as express } from 'express';
import * as routes from './routes';
import pino from 'express-pino-logger';
import { v4 as uuid } from 'uuid';

const app = express();

app.use(pino({
  enabled: process.env.NODE_ENV !== 'test',
  genReqId: () => uuid(),
  level: 'debug',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('/ping', routes.ping);
app.get('/avatar', routes.avatar);
app.post('/hooks/lidarr', routes.hooks.lidarr);
app.post('/hooks/plex', routes.hooks.plex);
app.post('/hooks/radarr', routes.hooks.radarr);
app.post('/hooks/sonarr', routes.hooks.sonarr);

export default app;
