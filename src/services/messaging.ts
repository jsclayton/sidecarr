import PQueue from 'p-queue';
import log from '../log';

const processingQueue = new PQueue({ concurrency: 1 }); 

class Subscription {

  name: string;
  route: string;
  handler: (data: object) => void;

  constructor(name: string, route: string, handler: (data: object) => void) {

    this.name = name;
    this.route = route;
    this.handler = handler;
  }
}

const subscriptions: Array<Subscription> = [];

export function publish(event: string, data: object) {

  processingQueue.add(async () => {

    for (const subscription of subscriptions) {
      
      if (subscription.route === event) {
        try {
          await subscription.handler(data);
          log.debug({ name: `MQ: ${subscription.name.toUpperCase()}`, data }, `Processed ${event}`);
        } catch (err) {
          log.error(err, `Error processing ${event}`);
        }
      }
    }
  });
}

export function subscribe(name: string, route: string, handler: (data: object) => void) {

  subscriptions.push(new Subscription(name, route, handler));
}