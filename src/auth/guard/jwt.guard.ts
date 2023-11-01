import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';

export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(error, user) {
    if (error || !user) {
      throw new UnauthorizedException({ error });
    }

    return user;
  }
}
