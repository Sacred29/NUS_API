import { Controller, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags, } from '@nestjs/swagger';
import { AttestationService } from './attestation.service';
import { Body, Get, Param,  Req, Res } from '@nestjs/common';
import { ClaimDto } from 'src/auth/dto/claim.dto';

@Controller('attestation')
@ApiTags("Attestation Manager")
export class AttestationController {
constructor(
    private readonly attestationService: AttestationService
) {}

// @Post('/deployDocStore/:privKey')
// @ApiParam({ name:"privKey" })
// async deploy(@Param() {privKey}) {
//     console.log(privKey)
//     return this.attestationService.deployDocumentStore(privKey);
// }

@Post('/Issue')
async wrapper(@Body() documents: ClaimDto){
    
    return await this.attestationService.wrap(documents);
    
}

@Get('/wrappedDoc/:docRoot')
@ApiParam({name: "docRoot"})
async getWrappedDoc (@Param() {docRoot}) {
    return await this.attestationService.getWrappedDoc(docRoot)
}

@Post('DocStore')
async deploy(){
    return await this.attestationService.deploy()
}
}

