import { Expose, Type, Transform, plainToClass } from 'class-transformer';
import 'reflect-metadata';

export class Account {
  id?: string;
  thumb?: string;
  title?: string;
};

export class Metadata {

  constructor() {

    this.type = 'unknown';
  }

  @Type(() => Date)
  @Transform((value) => new Date(value * 1000))
  addedAt?: Date;

  @Type(() => Date)
  @Transform((value) => new Date(value * 1000))
  updatedAt?: Date;

  @Type(() => Date)
  @Transform((value) => new Date(value * 1000))
  lastViewedAt?: Date;

  grandparentTitle?: string;
  parentTitle?: string;
  ratingKey?: string;
  skipParent?: boolean;
  tagline?: string;
  title?: string;
  type: string
};

export class Player {
  local?: boolean;
  publicAddress?: string;
  title?: string;
  uuid?: string;
}

export class Server {
  title?: string;
  uuid?: string;
}

export class Payload {
  event: string;
  user?: boolean;
  owner?: boolean;

  constructor() {

    this.event = 'unknown';
  }

  static parse(input: string | any) {

    if (typeof input === 'string') {
      input = JSON.parse(input);
    }
    return plainToClass(Payload, input)
  }

  @Expose({ name: 'Account' })
  @Type(() => Account)
  account?: Account;

  @Expose({ name: 'Metadata' })
  @Type(() => Metadata)
  metadata?: Metadata;

  @Expose({ name: 'Player' })
  @Type(() => Player)
  player?: Player;

  @Expose({ name: 'Server' })
  @Type(() => Server)
  server?: Server;
}
