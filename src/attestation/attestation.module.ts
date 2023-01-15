import { Module } from '@nestjs/common';
import { AttestationController } from './attestation.controller';
import { AttestationService } from './attestation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentSchema } from './schema/document.schema';
import { Web3Module } from 'src/web3/web3.module';


@Module({
  imports:[MongooseModule.forFeature([{ name: 'Documents', schema: DocumentSchema }]), Web3Module],
  providers: [AttestationService],
  controllers: [AttestationController],
  exports: [AttestationService]
})
export class AttestationModule {}
