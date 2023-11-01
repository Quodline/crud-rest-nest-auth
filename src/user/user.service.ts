import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateBodyDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateUser(id: number, body: UpdateBodyDto) {
    try {
      return this.prisma.user.update({
        where: { id },
        data: body,
      });
    } catch (error) {
      throw error instanceof Prisma.PrismaClientKnownRequestError
        ? new NotFoundException('User not found')
        : error;
    }
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
