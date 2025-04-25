import { IsString, IsEmail, IsOptional, IsNumber, IsDate, IsUrl, IsDecimal, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShopAuthDto {
    @ApiProperty({ example: 'Shop Name' })
    @IsString()
    @Length(1, 255)
    name: string;

    @ApiProperty({ example: 'About the shop', required: false })
    @IsString()
    @IsOptional()
    about: string;

    @ApiProperty({ example: 'https://example.com', required: false })
    @IsUrl()
    @IsOptional()
    web_url: string;

    @ApiProperty({ example: 'https://example.com/icon.png', required: false })
    @IsUrl()
    @IsOptional()
    icon_url: string;

    @ApiProperty({ example: 'https://example.com/image.png', required: false })
    @IsUrl()
    @IsOptional()
    image_url: string;

    @ApiProperty({ example: '1234567890' })
    @IsString()
    @Matches(/^\d{10}$/, { message: 'Mobile number must be 10 digits' })
    mobile_no: string;

    @ApiProperty({ example: '0987654321' })
    @IsString()
    @Matches(/^\d{10}$/, { message: 'Alternate mobile number must be 10 digits' })
    alternate_mobile_no: string;

    @ApiProperty({ example: 'example@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'securepassword', required: false })
    @IsString()
    @IsOptional()
    password: string;

    @ApiProperty({ example: '123 Main Street' })
    @IsString()
    street: string;

    @ApiProperty({ example: 'New York' })
    @IsString()
    city: string;

    @ApiProperty({ example: 'New York' })
    @IsString()
    state: string;

    @ApiProperty({ example: '10001' })
    @IsString()
    postal_code: string;

    @ApiProperty({ example: 'USA' })
    @IsString()
    country: string;

    @ApiProperty({ example: 'Retail', required: false })
    @IsString()
    @IsOptional()
    category: string;

    @ApiProperty({ example: '09:00' })
    @IsString()
    @Matches(/^\d{2}:\d{2}$/, { message: 'Open time must be in HH:MM format' })
    open_time: string;

    @ApiProperty({ example: '18:00' })
    @IsString()
    @Matches(/^\d{2}:\d{2}$/, { message: 'Close time must be in HH:MM format' })
    close_time: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    owner_id: number;

    @ApiProperty({ example: '2023-01-01', required: false })
    @IsDate()
    @IsOptional()
    business_start_date: Date;

    @ApiProperty({ example: '22AAAAA0000A1Z5', required: false })
    @IsString()
    @IsOptional()
    gst_no: string;

    @ApiProperty({ example: '123456789012', required: false })
    @IsString()
    @IsOptional()
    acc_no: string;

    @ApiProperty({ example: 'SBIN0001234', required: false })
    @IsString()
    @IsOptional()
    ifsc_code: string;

    @ApiProperty({ example: 'Main Branch', required: false })
    @IsString()
    @IsOptional()
    bank_branch: string;

    @ApiProperty({ example: 40.7128, required: false })
    @IsDecimal()
    @IsOptional()
    latitude: number;

    @ApiProperty({ example: -74.0060, required: false })
    @IsDecimal()
    @IsOptional()
    longitude: number;

    @ApiProperty({ example: '10%', required: false })
    @IsString()
    @IsOptional()
    VAT: string;
}
