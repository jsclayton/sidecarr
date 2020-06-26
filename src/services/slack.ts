import { WebClient, WebAPICallResult } from '@slack/web-api';
import { Payload } from '../plex/models/webhooks';
import { Message } from '../models/database/slack';
import { URL } from '../constants';
import config from '../config';

const slack = new WebClient(config.slack.token);

interface ChatPostMessageResult extends WebAPICallResult {
  channel: string;
  ts: string
};

export class WebhookMessage {

  [props: string]: unknown;

  private constructor(payload: Payload) {

    const { account } = payload;

    let imageElement;
    if (account) {
      imageElement = {
        type: 'image',
        image_url: URL(`/avatar?url=${encodeURIComponent(account.thumb as string)}`),
        alt_text: payload.account?.title
      }
    }

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
          imageElement,
          {
            type: 'mrkdwn',
            text: `*${payload.account?.title}* ${this.formatEvent(payload.event)} on *${payload.player?.title}*`
          }
        ].filter(Boolean)
      }
    ]
    this.username = payload.server?.title
  }

  static fromPayload(payload: Payload): WebhookMessage | undefined {

    if (payload.event !== 'media.scrobble' || payload.metadata?.type === 'track') {
      return;
    }

    return new WebhookMessage(payload);
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

  private formatTitle(payload: Payload): string {

    const { metadata, server } = payload;
    const title = metadata?.type === 'episode' ? metadata.grandparentTitle : metadata?.title;
    const subtitle = metadata?.type === 'episode' ? metadata.title : metadata?.tagline;
    return `*${title}*\n${subtitle}`;
  }

  async post(channel: string) {

    const result = await slack.chat.postMessage({ text: '', ...this, channel }) as ChatPostMessageResult;
    // const message = Message.create(result);
    // await message.save();
  }
}

export default slack;
