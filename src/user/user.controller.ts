import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/entities/user.entity';
import { getUser } from 'src/auth/decorators/get-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Auth()
  @Get('/resume')
  getProfileResume(@getUser() user: User,) {
    return this.userService.getProfileResume(user)
  }
}
