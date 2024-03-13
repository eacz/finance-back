import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  //async create(createUserDto: CreateUserDto) {
  //  try {
  //    const encryptedPassword = bcrypt.hashSync(createUserDto.password, 10);

  //    const user = await this.userModel.create({
  //      ...createUserDto,
  //      password: encryptedPassword,
  //    });
  //    user.password = undefined;

  //    const payload: JwtPayload = { username: user.username };
  //    const token = this.jwtService.sign(payload, {
  //      expiresIn: this.configService.get('JWT_EXPIRES') || 600,
  //    });

  //    return { token, user };
  //  } catch (error) {
  //    console.log(error);
  //    if (error instanceof MongoServerError) {
  //      if (error.code === 11000) {
  //        throw new UnprocessableEntityException(
  //          `${Object.keys(error.keyValue)[0]} '${
  //            error.keyValue[Object.keys(error.keyValue)[0]]
  //          }' is already in use`,
  //        );
  //      }
  //    }
  //  }
  //}

  //async login(loginDto: LoginDto) {
  //  const { password, username } = loginDto;
  //  const user = await this.userModel.findOne({ username: username });

  //  if (user && (await bcrypt.compare(password, user.password))) {
  //    const payload: JwtPayload = { username };
  //    const token = this.jwtService.sign(payload, {
  //      expiresIn: this.configService.get('JWT_EXPIRES') || 600,
  //    });

  //    user.password = undefined;

  //    return { token, user };
  //  } else {
  //    throw new UnauthorizedException('Invalid credentials');
  //  }
  //}

  //async findOneByUsername(username: string) {
  //  const user = await this.userModel.findOne({ username }).lean();
  //  return user;
  //}
}
