import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber, IsOptional,
  IsString
} from 'class-validator';

export enum BlockingUserType {
  USER = 'USER'
}



export class PaginationDto {
  @ApiProperty({ example: 'Some text' })
  @IsString()
  @IsOptional()
  searchText?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  pagNo?: number;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  limit?: number;
}
