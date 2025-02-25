import { IsNotEmpty, IsString, IsNumber, IsEmail, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserAddressDto {
    @ApiProperty({ description: 'ID of the user' })
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @ApiProperty({ description: 'name of the user' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Address of the user' })
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty({ description: 'City of the user' })
    @IsNotEmpty()
    @IsString()
    city: string;

    @ApiProperty({ description: 'State of the user' })
    @IsNotEmpty()
    @IsString()
    state: string;

    @ApiProperty({ description: 'Postal code of the user' })
    @IsNotEmpty()
    @IsString()
    postalCode: string;

    @ApiProperty({ description: 'Country of the user' })
    @IsNotEmpty()
    @IsString()
    country: string;

    @ApiProperty({ description: 'Phone number of the user' })
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber('IN')
    phone: string;

    @ApiProperty({ description: 'Email of the user' })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Delivery instructions for the address', required: false })
    @IsString()
    deliveryInstructions: string;

    @ApiProperty({ description: 'Type of the address' })
    @IsNotEmpty()
    @IsString()
    addressType: string;
}
