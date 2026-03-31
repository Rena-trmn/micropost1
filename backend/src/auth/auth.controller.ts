import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ){
    return this.authService.getAuth(email, password);
  }

  @Post('signup')
  async signup(
    @Body('name')name: string,
    @Body('email')email: string,
    @Body('password')password: string,
  ){
    return this.authService.signup(name, email, password);
  }
}