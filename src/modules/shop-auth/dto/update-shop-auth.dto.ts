import { PartialType } from '@nestjs/mapped-types';
import { CreateShopAuthDto } from './create-shop-auth.dto';

export class UpdateShopAuthDto extends PartialType(CreateShopAuthDto) {}
