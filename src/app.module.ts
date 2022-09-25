import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MedicationModule } from './medication/medication.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { ConfigModule } from '@nestjs/config';
// import { ScheduleModule } from '@nestjs/schedule';
// import { TerminusModule } from '@nestjs/terminus';
// import { TerminusOptionsService } from './terminus-options.service';
import { AuthModule } from './auth/auth.module';
import { TokenController } from './token/token.controller';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://localhost/care`,),

  UserModule, MedicationModule, AuthModule, TokenModule],
  controllers: [AppController, TokenController],
  providers: [AppService],
})
export class AppModule {}
