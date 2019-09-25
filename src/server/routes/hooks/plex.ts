import { NextFunction, Request, Response } from 'express';
import { default as multer } from 'multer';
import { WebClient } from '@slack/web-api';

const upload = multer();

const slack = new WebClient(process.env.SLACK_TOKEN);

interface PlexWebhook {
  event: string,
  Account: {
    title: string
  }
}

export default [
  upload.single('thumb'),
  async function (req: Request, res: Response) {

    const { body } = req;
    let { payload } = body;
    if (!payload) {
      return res.sendStatus(200);
    }
    const plexPayload: PlexWebhook =  payload = JSON.parse(payload);

    req.log.info({ payload }, 'Webhook received');

    await slack.chat.postMessage({
      channel: 'plex',
      text: 'Received webhook from Plex',
      attachments: [
        { text: plexPayload.event },
        { text: plexPayload.Account.title }
      ]
    })

    res.sendStatus(200);
  },
  function (err: any, req: Request, res: Response, next: NextFunction) {

    req.log.error(err);
    return res.sendStatus(200);
  }];