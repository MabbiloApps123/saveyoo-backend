import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateFavouriteDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({example:5,description:"Mapped store product id should be given"})
  store_product_id: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({example:2})
  user_id: number;


}
