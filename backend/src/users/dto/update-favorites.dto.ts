import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFavoritesDto {
    @ApiProperty({ example: ['USD', 'EUR', 'XOF'], description: 'Liste des codes de devises favorites' })
    @IsArray()
    @IsString({ each: true })
    currencies: string[];
}
