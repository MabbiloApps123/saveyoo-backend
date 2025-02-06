import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsDate, IsPositive, ValidateIf, IsBoolean, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStoreProductDto {
  @ApiProperty({ example: 1, description: 'ID of the store' })
  @IsNumber()
  @IsPositive()
  store_id: number;

  @ApiProperty({ example: 1, description: 'ID of the product' })
  @IsNumber()
  @IsPositive()
  product_id: number;

  @ApiProperty({ example: 15.0, description: 'Original price of the product' })
  @IsNumber()
  @IsPositive()
  original_price: number;

  @ApiProperty({ example: 5.0, description: 'Discounted price of the product' })
  @IsNumber()
  @IsPositive()
  @ValidateIf((dto) => dto.discounted_price <= dto.original_price)
  discounted_price: number;

  @ApiProperty({ example: 'INR', description: 'Currency of the pricing' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ example: 'last_chance_deals,available_now,dinnertime_deals', description: 'Currency of the pricing' })
  @IsString()
  @IsNotEmpty()
  deal_type: string;

  @ApiProperty({ example: 10, description: 'Available quantity' })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  is_surprise: boolean;

  @ApiProperty({ example: '18:00', description: 'Pickup start time (HH:mm)' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'pickup_start_time must be in HH:mm format',
  })
  pickup_start_time: string;

  @ApiProperty({ example: '20:00', description: 'Pickup end time (HH:mm)' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'pickup_end_time must be in HH:mm format',
  })
  @ValidateIf((dto) => dto.pickup_end_time > dto.pickup_start_time)
  pickup_end_time: string;
}
