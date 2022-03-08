import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { StatusModel } from 'src/common/others.model';
import { ForAuth } from 'src/auth/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { CasinoInput } from './casino.input';
import { FunnyService } from './funny.service';
import { CurUser } from 'src/auth/curuser.dec';

@Resolver()
export class FunnyResolver {
  constructor(private funnyService: FunnyService) {}

  @ForAuth()
  @Mutation(() => StatusModel)
  async casino(
    @CurUser() user: UserEntity,
    @Args('casinoinput') data: CasinoInput,
  ) {
    return await this.funnyService.casino(user, data);
  }
}
