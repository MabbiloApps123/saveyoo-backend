import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: 'sample@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email_id: string;

  @ApiProperty()
  @IsOptional()
  password: string;

  @ApiProperty({ example: '' })
  @IsOptional()
  @IsString()
  device_token: string;
}