import { default as express } from 'express';
import * as routes from './routes';
import pino from 'express-pino-logger';
import uuid from 'uuid';
import multer from 'multer';

const app = express();
const upload = multer();

app.use(pino({
  enabled: process.env.NODE_ENV !== 'test'
}));
app.use(express.json());
app.use(express.urlencoded());

app.post('/hooks/plex', upload.single('thumb'), routes.hooks.log);
app.post('/hooks/radarr', routes.hooks.log);
app.post('/hooks/sonarr', routes.hooks.log);

export default app;
