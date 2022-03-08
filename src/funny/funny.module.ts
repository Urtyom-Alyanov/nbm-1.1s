import { Module } from '@nestjs/common';
import { FunnyService } from './funny.service';
import { FunnyResolver } from './funny.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [FunnyService, FunnyResolver],
})
export class FunnyModule {}
