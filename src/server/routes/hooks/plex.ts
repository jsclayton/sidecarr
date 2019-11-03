import { NextFunction, Request, Response } from 'express';
import { default as multer } from 'multer';
import asyncHandler from '../../../server/asyncHandler';
import slack from '../../../services/slack';
import { Payload } from '../../../plex/models/webhooks';

const upload = multer();

class Message {

  [props: string]: unknown;

  text: string = '';

  private constructor(payload: Payload) {

    this.blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: this.formatTitle(payload),
          verbatim: true
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'image',
            image_url: payload.account.thumb,
            alt_text: payload.account.title
          },
          {
            type: 'mrkdwn',
            text: `*${payload.account.title}* ${this.formatEvent(payload.event)} on *${payload.player.title}*`
          }
        ]
      }
    ]
    this.username = payload.server.title
  }

  static fromPayload(payload: Payload) : Message | undefined {

    if (payload.metadata.type === 'track') {
      return;
    }

    return new Message(payload);
  }

  private formatEvent(event: string) {

    switch (event) {
      case 'media.play':
        return 'is watching';
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

  private formatTitle(payload: Payload) : string {

    const { metadata, server } = payload;
    const title = metadata.type === 'episode' ? metadata.grandparentTitle : metadata.title;
    const subtitle = metadata.type === 'episode' ? metadata.title : metadata.tagline;
    return `*${title}*\n${subtitle}`;
  }

  async post(channel: string) {

    await slack.chat.postMessage({ ...this, channel })
  }
}

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
    const message = Message.fromPayload(payload);
    if (message) {
      await message.post('plex');
    }

    res.sendStatus(200);
  }),
  function (err: any, req: Request, res: Response, next: NextFunction) {

    req.log.error(err);
    return res.sendStatus(200);
  }];