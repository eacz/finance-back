import { Controller, Post, Body } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //@Post('signup')
  //create(@Body() createUserDto: CreateUserDto) {
  //  return this.authService.create(createUserDto);
  //}

  //@Post('login')
  //login(@Body() loginDto: LoginDto) {
  //  return this.authService.login(loginDto);
  //}
}
