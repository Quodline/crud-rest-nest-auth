import {
  Body,
  Controller,
  Delete,
  Get,
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
  updateName(@Param() { id }: IdParamDto, @Body() body: UpdateBodyDto) {
    return this.userService.updateUser(+id, body);
  }

  @Delete(':id')
  delete(@Param() { id }: IdParamDto) {
    return this.userService.deleteUser(+id);
  }
}
