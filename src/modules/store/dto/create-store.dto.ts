import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddressDto {
  @ApiProperty({ example: 'mount road' })
  street: string;
  @ApiProperty({ example: 'chennai' })
  city: string;
  @ApiProperty({ example: 'tamil nadu' })
  state: string;
  @ApiProperty({ example: '600050' })
  postalCode: string;
  @ApiProperty({ example: 'india' })
  country: string;
}

export class ContactDto {
  @ApiProperty({ example: '9876543210' })
  phone: string;
  @ApiProperty({ example: 'sample@gmail.com' })
  email: string;
}
export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Store name' })
  name: string;

  @ApiProperty({ description: 'Store address' })
  address: AddressDto;

  @ApiProperty({ description: 'Store contact' })
  contact: ContactDto;
}
