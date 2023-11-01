import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { UpdateBodyDto, IdParamDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  profile(@GetUser() user: User) {
    return user;
  }

  @Patch(':id')
  async updateName(@Param() { id }: IdParamDto, @Body() body: UpdateBodyDto) {
    const { pass, ...user } = await this.userService.updateUser(+id, body);
    return user;
  }

  @Delete(':id')
  async delete(@Param() { id }: IdParamDto) {
    const { pass, ...deletedUser } = await this.userService.deleteUser(+id);
    return deletedUser;
  }
}
