import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  storeProductId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsPositive()
  quantity: number;
}