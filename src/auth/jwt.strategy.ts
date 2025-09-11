import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {
    super({
      // Tell the strategy where to find the token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Use the same secret as when you signed the token
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // This method runs after the token is successfully verified
  async validate(payload: { id: string; email: string }){
    const { id } = payload;
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }

    // NestJS will attach this user object to the request object (req.user)
    return user;
  }
}