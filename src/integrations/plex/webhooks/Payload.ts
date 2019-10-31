import { Expose, Type, Transform } from 'class-transformer';
import 'reflect-metadata';

export class Account {
  id!: string;
  thumb!: string;
  title!: string;
};

export class Metadata {
  @Type(() => Date)
  @Transform((value) => new Date(value * 1000))
  addedAt!: Date;

  @Type(() => Date)
  @Transform((value) => new Date(value * 1000))
  updatedAt!: Date;

  @Type(() => Date)
  @Transform((value) => new Date(value * 1000))
  lastViewedAt!: Date;

  grandparentTitle!: string;
  parentTitle!: string;
  ratingKey!: string;
  skipParent!: boolean;
  tagline!: string;
  title!: string;
  type!: string
};

export class Player {
  local!: boolean;
  publicAddress!: string;
  title!: string;
  uuid!: string;
}

export class Server {
  title!: string;
  uuid!: string;
}

export class WebhookPayload {
  event!: string;
  user!: boolean;
  owner!: boolean;

  @Expose({ name: 'Account' })
  @Type(() => Account)
  account!: Account;

  @Expose({ name: 'Metadata' })
  @Type(() => Metadata)
  metadata!: Metadata;

  @Expose({ name: 'Player' })
  @Type(() => Player)
  player!: Player;

  @Expose({ name: 'Server' })
  @Type(() => Server)
  server!: Server;
}
