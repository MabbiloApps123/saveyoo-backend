import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, IsOptional, IsDate, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Surprise Bag - Bakery' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://i.pcmag.com/imagery/articles/03xdeDG4m4n0gJG3CbFNIgm-17..v1661444591.png' })
  @IsString()
  @IsNotEmpty()
  product_image: string;

  @ApiProperty({ example: 'A surprise bag of fresh bakery items including bread, pastries, and more.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Bakery' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  store: number;

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
