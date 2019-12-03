import { NextFunction, Request, Response } from 'express';
import { default as multer } from 'multer';
import asyncHandler from '../../../server/asyncHandler';
import { WebhookMessage } from '../../../services/slack';
import { Payload } from '../../../plex/models/webhooks';
import * as mq from '../../../services/messaging';
import log from '../../../log';
import PQueue from 'p-queue';

const upload = multer();

const scrobbleQueue = new PQueue({ concurrency: 1 });

mq.subscribe('media.scrobble', (data) => {

  scrobbleQueue.add(async () => {

    const payload = data as Payload;
    
    log.debug(`Processing scrobble (${payload.account.title}): ${payload.metadata.title}`);

    // Future hawtness: https://github.com/tc39/proposal-nullish-coalescing
    const message = WebhookMessage.fromPayload(payload);
    if (message) {
      await message.post('plex');
    }

    log.debug(`Processed scrobble (${payload.account.title}): ${payload.metadata.title}`);
  })
});

export default [
  upload.single('thumb'),
  asyncHandler(async function (req: Request, res: Response) {

    const { body } = req;
    let { payload } = body;
    if (!payload) {
      return res.sendStatus(200);
    }
    payload = Payload.parse(payload);

    req.log.info({ payload }, `Plex ${payload.event} (${payload.account.title}): ${payload.metadata.title}`);

    mq.publish(payload.event, payload)

    res.sendStatus(200);
  }),
  function (err: any, req: Request, res: Response, next: NextFunction) {

    req.log.error(err);
    return res.sendStatus(200);
  }];