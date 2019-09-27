import { NextFunction, Request, RequestHandler, Response } from 'express';
import { default as multer } from 'multer';
import slack from '../../../services/slack';

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
            image_url: payload.Account.thumb,
            alt_text: payload.Account.title
          },
          {
            type: 'mrkdwn',
            text: `*${payload.Account.title}* ${this.formatEvent(payload.event)} on *${payload.Player.title}*`
          }
        ]
      }
    ]
    this.username = payload.Server.title
  }

  static fromPayload(payload: Payload) : Message | undefined {

    if (payload.Metadata.type === 'track') {
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

    const { Metadata: metadata, Server: server } = payload;
    const title = metadata.type === 'episode' ? metadata.grandparentTitle : metadata.title;
    const subtitle = metadata.type === 'episode' ? metadata.title : metadata.tagline;
    return `*${title}*\n${subtitle}`;
  }

  async post(channel: string) {

    await slack.chat.postMessage({ ...this, channel })
  }
}

interface Payload {
  event: string,
  Account: {
    thumb: string,
    title: string
  },
  Metadata: {
    grandparentTitle: string,
    parentTitle: string,
    ratingKey: string,
    skipParent: boolean,
    tagline: string,
    title: string,
    type: string
  },
  Player: {
    title: string
  },
  Server: {
    title: string,
    uuid: string
  }
}

const asyncHandler = function(func: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = func.call(undefined, req, res, next);
    return result && result.catch ? result.catch(next) : result;
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
    payload = JSON.parse(payload);

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