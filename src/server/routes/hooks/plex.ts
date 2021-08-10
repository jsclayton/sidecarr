import { NextFunction, Request, Response } from 'express';
import { default as multer } from 'multer';
import asyncHandler from '../../../server/asyncHandler';
import { WebhookMessage } from '../../../services/slack';
import { Payload } from '../../../plex/models/webhooks';
import * as mq from '../../../services/messaging';

const upload = multer();

mq.subscribe('Scrobble to Slack', 'plex:media:scrobble', async (data) => {

  const payload = data as Payload;
  const message = WebhookMessage.fromPayload(payload);
  await message?.post();
});

export default [
  upload.single('thumb'),
  asyncHandler(async function (req: Request, res: Response) {

    const { body } = req;
    if (!body.payload) {
      return res.sendStatus(200);
    }

    const payload = Payload.parse(body.payload);
    req.log.debug({ payload }, `Plex ${payload.event} (${payload.account?.title}): ${payload.metadata?.title}`);
    mq.publish(`plex:${payload.event.replace('.', ':')}`, payload)

    res.sendStatus(200);
  }),
  function (err: any, req: Request, res: Response, next: NextFunction) {

    req.log.error(err);
    return res.sendStatus(200);
  }];