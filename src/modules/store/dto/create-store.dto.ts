import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ example: 'My Store' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'http://example.com/image.jpg' })
  @IsOptional()
  image_url: string;

  @ApiProperty({ example: '1234567890' })
  @IsNotEmpty()
  mobile_no: string;

  @ApiProperty({ example: '1234567890' })
  @IsOptional()
  alternate_mobile_no: string;

  @ApiProperty({ example: 'store@example.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'mount road' })
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'Chennai' })
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Tamil Nadu' })
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: '600001' })
  @IsNotEmpty()
  postal_code: string;

  @ApiProperty({ example: 'India' })
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: '09:00' })
  @IsNotEmpty()
  open_time: string;

  @ApiProperty({ example: '21:00' })
  @IsNotEmpty()
  close_time: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  owner_id: number;

  @ApiProperty({ example: 13.0827 })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 80.2707 })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
