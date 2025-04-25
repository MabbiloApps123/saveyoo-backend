import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsEmail } from 'class-validator';

export class CreateOrderDto {
    @ApiProperty({ example: 'ORD12345', description: 'Unique order number' })
    @IsNotEmpty()
    @IsString()
    order_number: string;

    @ApiProperty({ example: 1000.50, description: 'Total amount of the order' })
    @IsNotEmpty()
    @IsNumber()
    total_amount: number;

    @ApiProperty({ example: 100.00, description: 'Discount applied to the order' })
    @IsOptional()
    @IsNumber()
    discount: number;

    @ApiProperty({ example: 900.50, description: 'Final amount after discount' })
    @IsNotEmpty()
    @IsNumber()
    final_amount: number;

    @ApiProperty({ example: 'Pending', description: 'Payment status of the order' })
    @IsNotEmpty()
    @IsString()
    payment_status: string;

    @ApiProperty({ example: 'Processing', description: 'Current status of the order' })
    @IsNotEmpty()
    @IsString()
    order_status: string;

    @ApiProperty({ example: 'John Doe', description: 'Name of the customer' })
    @IsNotEmpty()
    @IsString()
    customer_name: string;

    @ApiProperty({ example: 'customer@example.com', description: 'Email of the customer' })
    @IsNotEmpty()
    @IsEmail()
    customer_email: string;

    @ApiProperty({ example: '1234567890', description: 'Mobile number of the customer' })
    @IsNotEmpty()
    @IsString()
    customer_mobile_no: string;

    @ApiProperty({ example: '123 Main Street', description: 'Shipping address of the order' })
    @IsNotEmpty()
    @IsString()
    shipping_address: string;

    @ApiProperty({ example: 'New York', description: 'City of the shipping address' })
    @IsNotEmpty()
    @IsString()
    city: string;

    @ApiProperty({ example: 'New York', description: 'State of the shipping address' })
    @IsNotEmpty()
    @IsString()
    state: string;

    @ApiProperty({ example: '10001', description: 'Postal code of the shipping address' })
    @IsNotEmpty()
    @IsString()
    postal_code: string;

    @ApiProperty({ example: 'USA', description: 'Country of the shipping address' })
    @IsNotEmpty()
    @IsString()
    country: string;

    @ApiProperty({ example: '2023-10-01T10:00:00', description: 'Date of the order' })
    @IsOptional()
    order_date: Date;

    @ApiProperty({ example: 1, description: 'ID of the store associated with the order' })
    @IsNotEmpty()
    @IsNumber()
    store_id: number;
}
