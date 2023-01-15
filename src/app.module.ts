import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
//import { MedicationModule } from './medication/medication.module';
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
import { AttestationController } from './attestation/attestation.controller';
import { AttestationModule } from './attestation/attestation.module';
import { Web3Module } from './web3/web3.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://localhost/care`,),

  UserModule, AuthModule, TokenModule, AttestationModule, Web3Module, LoggerModule],
  controllers: [AppController, TokenController, AttestationController],
  providers: [AppService],
})
export class AppModule {}
