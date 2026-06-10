import { IsEmail, IsString, MinLength } from 'class-validator';

/** Form body for `POST /admin/login` (urlencoded). */
export class AdminLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}
