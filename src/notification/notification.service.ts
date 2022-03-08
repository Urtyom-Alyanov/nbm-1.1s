import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { pubSub } from './PubSub';
import { UserEntity } from 'src/user/user.entity';
import { NotifyModel } from './notif.model';
import { $$asyncIterator } from 'iterall';

export type FilterIteratorFn<T> = (
  rootVal?: T,
) => boolean | Promise<boolean> | Observable<boolean>;

export const asyncIteratorFilter = <T = any>(
  aIterator: AsyncIterator<T>,
  filterFn: FilterIteratorFn<T>,
) => {
  const getNextPromise = () =>
    aIterator.next().then((payload) =>
      payload.done
        ? payload
        : Promise.resolve(filterFn(payload.value))
            .then((filterResult) => (filterResult ? payload : getNextPromise()))
            .catch(() => false),
    );
  return {
    next() {
      return getNextPromise();
    },
    return() {
      return aIterator.return();
    },
    throw(error) {
      return aIterator.throw(error);
    },
    [$$asyncIterator]() {
      return this;
    },
  };
};

@Injectable()
export class NotificationService {
  async eventLoop(user: UserEntity): Promise<AsyncIterator<NotifyModel>> {
    return asyncIteratorFilter(
      pubSub.asyncIterator<NotifyModel>('notify'),
      (val) => user.id === val.forId,
    );
  }
}
