import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly tokenService: TokenService,
    ) { }


    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findOneUserViaEmail(email);
        if (user && pass) {
            const match = await compare(pass, user.password);
            if (!match) return null;

            const { _id, email } = user;
            return { _id, email };
        }
        return null;
    }

    async validateApiToken(token: string): Promise<any> {
        if (!token) throw new Error('Invalid token');
        return this.tokenService.findOneByToken(token);
      }

    async login(user: any) {
        
        const payload = { email: user.email, id: user.id }
        return {
            authToken: this.jwtService.sign(payload)
        }

    }
}
