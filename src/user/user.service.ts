import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateBodyDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateUser(id: number, body: UpdateBodyDto) {
    try {
      const { pass, ...user } = await this.prisma.user.update({
        where: { id },
        data: body,
      });

      return user;
    } catch (error) {
      throw error instanceof Prisma.PrismaClientKnownRequestError
        ? new NotFoundException('User not found')
        : error;
    }
  }

  async deleteUser(id: number) {
    await this.prisma.user.delete({
      where: { id },
    });

    return {};
  }
}
