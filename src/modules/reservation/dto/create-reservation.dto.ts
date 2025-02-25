import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  store_product_id: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string; // e.g., "Apple Pay", "PayPal"

  @IsDateString()
  @IsNotEmpty()
  collectionTime: string;
}
