import { Inject, Injectable } from '@nestjs/common';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { CasinoInput } from './casino.input';
import { NotifyModel } from './notif.model';
import { StatusModel } from './others.model';
import { UserEntity } from './user/user.entity';
import { UserService } from './user/user.service';
import { Observable } from "rxjs";
import { $$asyncIterator } from "iterall";

export type FilterIteratorFn<T> = (rootVal?: T) => boolean | Promise<boolean> | Observable<boolean>;

export const asyncIteratorFilter = <T = any>(aIterator: AsyncIterator<T>, filterFn: FilterIteratorFn<T>) => {
  const getNextPromise = () =>  aIterator.next().then(
    payload => payload.done ? payload : Promise.resolve(filterFn(payload.value))
    .then(filterResult => filterResult ? payload : getNextPromise())
    .catch(() => false)
  );
  return {
    next() {
      return getNextPromise()
    },
    return() {
      return aIterator.return()
    },
    throw(error) {
      return aIterator.throw(error)
    },
    [$$asyncIterator]() {
      return this;
    },
  }
}


export const pubSub = new PubSub();
export const pubEvent = async (ev: NotifyModel) => await pubSub.publish("notify", ev);

@Injectable()
export class AppService {
  constructor(
    @Inject(UserService)
    private userService: UserService
  ) {};

  async eventLoop(user: UserEntity): Promise<AsyncIterator<NotifyModel>> {
    return asyncIteratorFilter(
      pubSub.asyncIterator<NotifyModel>("notify"),
      (val) => user.id === val.forId
    )
  }

  async casino(user: UserEntity, data: CasinoInput): Promise<StatusModel> {
    const num = Math.round(Math.random() * 100);
    user.balance -= data.summ;
    if(num >= data.fortune) {
      user.balance += data.summ + (data.summ * (Number((data.fortune / 100).toFixed(1)) * 3))
    }
    this.userService.save([user]);
    return { isOk: num >= data.fortune }
  }
}
