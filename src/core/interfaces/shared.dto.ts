import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber, IsOptional,
  IsString
} from 'class-validator';
import { StoreProduct } from 'src/modules/store-products/entities/store-product.entity';

export enum BlockingUserType {
  USER = 'USER'
}



export class PaginationDto {
  @ApiProperty({ example: 'Some text' })
  @IsString()
  @IsOptional()
  searchText?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  pagNo?: number;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  limit?: number;
}

export type StoreProductWithDistance = {
  storeProduct: StoreProduct;
  distance: number;
};