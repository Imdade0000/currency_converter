import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FavoritesDto {
    @ApiProperty({ example: ['USD', 'EUR', 'XOF'] })
    @IsArray()
    @IsString({ each: true })
    currencies: string[];
}
