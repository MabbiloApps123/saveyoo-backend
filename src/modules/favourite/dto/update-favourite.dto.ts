import { CreateFavouriteDto } from './create-favourite.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateFavouriteDto extends PartialType(CreateFavouriteDto) {

    @IsOptional()
    @IsBoolean()
    @ApiProperty({example:false})
    is_active?: boolean;
}
