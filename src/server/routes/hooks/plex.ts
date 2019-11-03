import { NextFunction, Request, Response } from 'express';
import { default as multer } from 'multer';
import asyncHandler from '../../../server/asyncHandler';
import { WebhookMessage } from '../../../services/slack';
import { Payload } from '../../../plex/models/webhooks';

const upload = multer();

export default [
  upload.single('thumb'),
  asyncHandler(async function (req: Request, res: Response) {

    const { body } = req;
    let { payload } = body;
    if (!payload) {
      return res.sendStatus(200);
    }
    payload = Payload.parse(payload);

    req.log.info({ payload }, 'Webhook received');

    // Future hawtness: https://github.com/tc39/proposal-nullish-coalescing
    const message = WebhookMessage.fromPayload(payload);
    if (message) {
      await message.post('plex');
    }

    res.sendStatus(200);
  }),
  function (err: any, req: Request, res: Response, next: NextFunction) {

    req.log.error(err);
    return res.sendStatus(200);
  }];