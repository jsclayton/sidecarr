import { WebClient } from '@slack/web-api';
import { Payload } from '../plex/models/webhooks';

const slack = new WebClient(process.env.SLACK_TOKEN);

export class WebhookMessage {

  [props: string]: unknown;

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

  static fromPayload(payload: Payload): WebhookMessage | undefined {

    if (payload.metadata.type === 'track') {
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
    const title = metadata.type === 'episode' ? metadata.grandparentTitle : metadata.title;
    const subtitle = metadata.type === 'episode' ? metadata.title : metadata.tagline;
    return `*${title}*\n${subtitle}`;
  }

  async post(channel: string) {

    await slack.chat.postMessage({ text: '', ...this, channel })
  }
}

export default slack;
