import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { AppService } from './app.service';
import { CasinoInput } from './casino.input';
import { NotifyModel } from './notif.model';
import { StatusModel } from './others.model';
import { ForAuth } from './user/auth.guard';
import { CurUser } from './user/curuser.dec';
import { UserEntity } from './user/user.entity';

@Resolver()
export class AppResolver {
    constructor(
        private appService: AppService
    ) {};
    @ForAuth()
    @Subscription(() => NotifyModel)
    async subEvent(
        @CurUser() user: UserEntity
    ) {
        return await this.appService.eventLoop(user)
    };

    @ForAuth()
    @Mutation(() => StatusModel)
    async casino(
        @CurUser() user: UserEntity,
        @Args("casineinput") data: CasinoInput
    ) {
        return await this.appService.casino(user, data)
    };
}
