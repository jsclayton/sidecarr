import { EventEmitter } from 'events';

const queue = new EventEmitter();

export function publish(event: string, data: object) {

  queue.emit(event, data);
}

export function subscribe(event: string, handler: (data: object) => void) {

  queue.on(event, handler);
}