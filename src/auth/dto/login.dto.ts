import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  ValidateIf,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ValidateIf((dto) => !dto.email)
  username?: string;

  @IsEmail()
  @ValidateIf((dto) => !dto.username)
  email: string;

  @IsString()
  password: string;
}
