import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

/** Body for `POST /interaction/:uid/login`. */
export class LoginDto {
  @ApiProperty({ format: 'email', maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ minLength: 1, maxLength: 1024 })
  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  password!: string;
}
