import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import {
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsEnum,
  IsString,
  IsDate,
  IsBoolean,
  IsNumberString,
  IsPhoneNumber,
  IsOptional,
  IsNumber,
} from 'class-validator';

enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHERS = 'Others',
}

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  user_name: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email_id: string;

  @ApiProperty()
  @IsNumberString()
  @IsPhoneNumber()
  @IsOptional()
  mobile_no: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  invited_ref_code: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  referral_code: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  email_verified: boolean;

  @ApiProperty()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  @IsOptional()
  dob: Date | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  profile_url: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  device_token: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Gender, {
    message: 'gender must be either Male , Female or Others ',
  })
  gender: Gender;
}


export class GetBranchAndServiceSearch {
  @ApiProperty({ example: 'Some text' })
  @IsNotEmpty()
  @IsString()
  searchText: string;
}