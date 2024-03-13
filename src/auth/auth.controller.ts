import { Controller, Post, Body, Get } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

import { AuthService } from './auth.service';
import { getUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('test')
  @Auth()
  test(@getUser() user: User) {
    return user;
  }
}
