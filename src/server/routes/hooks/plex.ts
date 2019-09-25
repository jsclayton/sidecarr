import { NextFunction, Request, Response } from 'express';
import { default as multer } from 'multer';
import { WebClient } from '@slack/web-api';

const upload = multer();

const slack = new WebClient(process.env.SLACK_TOKEN);

interface PlexWebhook {
  event: string,
  Account: {
    title: string
  },
  Metadata: {
    title: string
  },
  Player: {
    title: string
  },
  Server: {
    title: string
  }
}

function niceEvent(event: string) {

  switch (event) {
    case 'media.play':
      return 'started watching';
    case 'media.stop':
      return 'stopped'
    case 'media.pause':
      return 'paused';
    case 'media.resume':
      return 'resumed';
    case 'media.scrobble':
      return 'scrobbled';
    default:
      return event
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
      text: `${plexPayload.Account.title} ${niceEvent(plexPayload.event)} ${plexPayload.Metadata.title} on ${plexPayload.Player.title}`,
      username: plexPayload.Server.title
    })

    res.sendStatus(200);
  },
  function (err: any, req: Request, res: Response, next: NextFunction) {

    req.log.error(err);
    return res.sendStatus(200);
  }];