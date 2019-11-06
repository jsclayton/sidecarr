import { BaseEntity, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('slack_messages')
export default class Message extends BaseEntity {

  @PrimaryColumn()
  readonly channel!: string;

  @PrimaryColumn()
  readonly ts!: string;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;
};
