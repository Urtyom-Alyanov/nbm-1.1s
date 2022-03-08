import { Resolver, Subscription } from '@nestjs/graphql';
import { ForAuth } from 'src/auth/auth.guard';
import { CurUser } from 'src/auth/curuser.dec';
import { UserEntity } from 'src/user/user.entity';
import { NotifyModel } from './notif.model';
import { NotificationService } from './notification.service';

@Resolver()
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  @ForAuth()
  @Subscription(() => NotifyModel)
  async subEvent(@CurUser() user: UserEntity) {
    return await this.notificationService.eventLoop(user);
  }
}
