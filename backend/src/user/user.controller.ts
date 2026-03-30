import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.userService.createUser(name, email, password);
  }

  @Get(':id')
  async getUser(
    @Param('id') id: string,
    @Query('token') token: string,
  ) {
    return this.userService.getUser(token, Number(id));
  }
}