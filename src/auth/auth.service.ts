import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    try {
      return await this.createUserToken(dto);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials taken');
      }

      throw e;
    }
  }

  async signin({ email, password }: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await argon.verify(user.pass, password))) {
      return this.signToken(user.id, user.email);
    }

    throw new ForbiddenException('Credentials incorrect');
  }

  private async createUserToken({ email, password }: AuthDto): Promise<string> {
    const hashed = await argon.hash(password);

    const user = await this.prisma.user.create({
      data: { email, pass: hashed },
    });

    return this.signToken(user.id, email);
  }

  private signToken(userId: number, email: string): Promise<string> {
    const payload = { email, sub: userId };

    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
