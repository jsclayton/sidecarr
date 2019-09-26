import { default as express } from 'express';
import * as routes from './routes';
import pino from 'express-pino-logger';
import uuid from 'uuid';

const app = express();

app.use(pino({
  enabled: process.env.NODE_ENV !== 'test',
  genReqId: () => uuid.v4()
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/hooks/plex', routes.hooks.plex);
app.post('/hooks/radarr', routes.hooks.log);
app.post('/hooks/sonarr', routes.hooks.log);

export default app;
