import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiStrategy extends PassportStrategy(Strategy, 'api') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(token: string): Promise<any> {
    try {
      const user = await this.authService.validateApiToken(token);
      return { id: user._id, email: user.email, token };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
