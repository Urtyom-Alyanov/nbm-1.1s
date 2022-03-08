import { PubSub } from 'graphql-subscriptions';
import { NotifyModel } from './notif.model';

export const pubSub = new PubSub();
export const pubEvent = async (ev: NotifyModel) =>
  await pubSub.publish('notify', ev);
