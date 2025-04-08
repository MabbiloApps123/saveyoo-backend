import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional, IsInt, Min, IsArray } from 'class-validator';

export class TimeSensitiveProductsDto {
  @IsNumber()
  @ApiProperty({ example: 13.106743, description: 'Latitude of the user location',required:false })
  @Type(() => Number)
  @IsOptional()
  userLat: number;

  @IsNumber()
  @ApiProperty({ example: 80.241242, description: 'Longitude of the user location',required:false })
  @Type(() => Number)
  @IsOptional()
  userLng: number;

  @IsNumber()
  @ApiProperty({ example: 1, description: 'User ID',required:false })
  @Type(() => Number)
  @IsOptional()
  user_id: number;

  @IsNumber()
  @ApiProperty({ example: 20, description: 'Radius',required:false })
  @Type(() => Number)
  @IsOptional()
  radius: number;

  @IsOptional()
  @ApiProperty({
    example: ['vegan', 'vegetarian'],
    description: 'Diet Preferences for filtering (multiple values allowed)',
    required: false,
    type: [String],
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) // Ensures single value becomes an array
  dietPreference?: string[];

  @IsOptional()
  selectedProductIds?: number[];
}

export class TimeSensitiveProductsDtoExplore extends TimeSensitiveProductsDto {
    @IsString()
    @ApiProperty({ example: 'available_now', description: 'Section name for section-based filters', required: false })
    @Type(() => String)
    @IsOptional()
    sectionType?: string;
  
    @IsString()
    @ApiProperty({ example: 'meals', description: 'Food type for filter', required: false })
    @Type(() => String)
    @IsOptional()
    foodType?: string;
  

  
    @IsString()
    @ApiProperty({ example: '09:00', description: 'Pickup start time filter', required: false })
    @Type(() => String)
    @IsOptional()
    startTime?: string;
  
    @IsString()
    @ApiProperty({ example: '17:00', description: 'Pickup end time filter', required: false })
    @Type(() => String)
    @IsOptional()
    endTime?: string;
  
    @IsString()
    @ApiProperty({ example: 'pizza', description: 'Search query for product name, store name, etc.', required: false })
    @Type(() => String)
    @IsOptional()
    search?: string;
  
    @IsInt()
    @Min(1)
    @ApiProperty({ example: 1, description: 'Page number for pagination', required: false, default: 1 })
    @Type(() => Number)
    @IsOptional()
    page?: number = 1;
  
    @IsInt()
    @Min(1)
    @ApiProperty({ example: 10, description: 'Limit per page for pagination', required: false, default: 10 })
    @Type(() => Number)
    @IsOptional()
    limit?: number = 10;

    @IsString()
    @ApiProperty({
      example: 'Popular',
      description: 'Sort option for the results',
      required: false,
      enum: ['popular', 'newest', 'review', 'lowest-to-high', 'highest-to-low'],
    })
    @Type(() => String)
    @IsOptional()
    sort?: 'popular'| 'newest'| 'review'| 'low-to-high'| 'hig-to-low';
  }
  
