import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsDate, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateStoreProductDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  store_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  product_id: number;

  @ApiProperty({ example: 15.0 })
  @IsNumber()
  @IsPositive()
  original_price: number;

  @ApiProperty({ example: 5.0 })
  @IsNumber()
  @IsPositive()
  discounted_price: number;

  @ApiProperty({ example: 'INR' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: '2024-11-22T14:00:00' })
  @IsDate()
  @Type(() => Date)
  pickup_start_time: Date;

  @ApiProperty({ example: '2024-11-22T18:00:00' })
  @IsDate()
  @Type(() => Date)
  pickup_end_time: Date;
}

