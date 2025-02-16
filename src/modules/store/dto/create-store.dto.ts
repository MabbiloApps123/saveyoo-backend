import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsDate, ValidateNested, IsObject } from 'class-validator';

class LocationDto {
  @ApiProperty({ example: 12.971598, description: 'Latitude of the location' })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 77.594566, description: 'Longitude of the location' })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
export class CreateStoreDto {
  @ApiProperty({ example: 'My Store' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'http://example.com/image.jpg' })
  @IsOptional()
  image_url: string;

  @ApiProperty({ example: 'http://example.com/image.jpg' })
  @IsOptional()
  icon_url: string;

  @ApiProperty({ example: 'store details' })
  @IsOptional()
  about: string;

  @ApiProperty({ example: 'http://example.com/image.jpg' })
  @IsOptional()
  web_url: string;

  @ApiProperty({ example: '1234567890' })
  @IsNotEmpty()
  mobile_no: string;

  @ApiProperty({ example: '1234567890' })
  @IsOptional()
  alternate_mobile_no: string;

  @ApiProperty({ example: 'store@example.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'supermarket' })
  @IsNotEmpty()
  category: string;

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

  // @IsNotEmpty()
  // @ApiProperty({
  //   example: {
  //     type: 'Point',
  //     coordinates: [-74.006, 40.7128], // Replace with actual data
  //   },
  // })
  // location: string;

  @ApiProperty({ example: 13.0827 })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 80.2707 })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: '2024-11-22T14:00:00', description: 'The start date of the business' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  business_start_date: Date;

  @ApiProperty({ example: '29ABCDE1234F1Z5', description: 'The GST number of the business' })
  @IsOptional()
  @IsString()
  gst_no: string;

  @ApiProperty({ example: '1234567890', description: 'The account number of the business' })
  @IsOptional()
  @IsString()
  acc_no: string;

  @ApiProperty({ example: 'SBIN0001234', description: 'The IFSC code of the business bank account' })
  @IsOptional()
  @IsString()
  ifsc_code: string;

  @ApiProperty({ example: 'New Delhi', description: 'The branch of the business bank account' })
  @IsOptional()
  @IsString()
  bank_branch: string;

  @ApiProperty({ example: 'KGKJ9768678KJHI', description: 'The VAT no of the business' })
  @IsOptional()
  @IsString()
  VAT: string;
}
