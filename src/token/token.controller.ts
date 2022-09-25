import {
    Controller,
    Post,
    Get,
    Param,
    NotFoundException,
    ForbiddenException,
    UseGuards,
    Req,
  } from '@nestjs/common';
import { TokenService } from './token.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('token')
@ApiTags('Token Management')
export class TokenController {
    constructor(
        private readonly tokenService:TokenService,
    ){}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @ApiBearerAuth()
    async createToken(@Req() req) {
        try {
            return this.tokenService.create(req.user.id);
          } catch {
            throw new ForbiddenException();
          }
    }
}
