import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from 'src/token/token.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ApiStrategy } from './strategies/api.strategy';

@Module({
  imports: [UserModule, PassportModule, TokenModule, 
    PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: process.env.JWT_SEC ?? 'care-api-secret-proj',
    signOptions: {expiresIn: '24h'},
  })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, ApiStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
