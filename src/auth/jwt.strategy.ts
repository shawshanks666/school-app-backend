import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // This method is called after the token has been successfully verified.
  // The value returned here is attached to the request object as `req.user`.
  async validate(payload: any) {
    // You could add logic here to look up the user in the DB to ensure they still exist.
    // For this assessment, returning the payload is sufficient.
    return { userId: payload.sub, email: payload.email };
  }
}
