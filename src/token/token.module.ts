import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { TokenSchema } from './schema/token.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }]), UserModule],
  controllers:[TokenController],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
