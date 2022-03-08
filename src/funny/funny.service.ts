import { Injectable } from '@nestjs/common';
import { StatusModel } from 'src/common/others.model';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { CasinoInput } from './casino.input';

@Injectable()
export class FunnyService {
  constructor(private userService: UserService) {}

  async casino(user: UserEntity, data: CasinoInput): Promise<StatusModel> {
    const num = Math.round(Math.random() * 100);
    user.balance -= data.summ;
    if (num >= data.fortune) {
      user.balance +=
        data.summ + data.summ * (Number((data.fortune / 100).toFixed(1)) * 3);
    }
    this.userService.save([user]);
    return { isOk: num >= data.fortune };
  }
}
