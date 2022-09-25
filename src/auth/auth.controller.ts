import { Body, Controller, Post, UseGuards, Req, Get, ConsoleLogger } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Authentication Manager')
export class AuthController {
    constructor(
        private readonly authService:AuthService,
        private readonly userService: UserService
    ){}

    @UseGuards(AuthGuard('local'))
    @Post('/login')
    @ApiBody({type: LoginDto})
    async login(@Req() req) {
      return this.authService.login(req.user);
    }

    
    
}
