import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthResponse } from './interfaces/authResponse';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDTO: LoginDto): Promise<AuthResponse> {
    const { password, username, email } = loginDTO;
    const where = { username, email };
    const user = await this.userRepository.findOne({
      where: where,
      select: [
        'id',
        'username',
        'firstName',
        'lastName',
        'email',
        'password',
        'active',
        'country',
        'createdAt',
        'updatedAt',
      ],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };

      const token = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_EXPIRES_IN') || 3600,
      });
      delete user.password;
      return { token, user: { ...user } };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async create(signupDTO: CreateUserDto): Promise<AuthResponse> {
    const { password } = signupDTO;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = this.userRepository.create({
      ...signupDTO,
      password: hashedPassword,
    });

    try {
      user = await this.userRepository.save(user);
      delete user.password;
      const payload: JwtPayload = { username: user.username };
      const token = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_EXPIRES_IN') || '600',
      });
      return {
        user,
        token,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async renewToken(token: string): Promise<AuthResponse> {
    try {
      const payload: JwtPayload = await this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { username: payload.username },
      });
      delete user.password;
      const newToken = this.jwtService.sign({ username: payload.username });
      return { token: newToken, user };
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  private handleErrors(error: any) {
    if (error.code === '23505') {
      let message = error.detail.includes('username') ? 'Username' : 'Email';
      message += ' already used';
      throw new ConflictException(message);
    } else {
      throw error;
    }
  }
}
