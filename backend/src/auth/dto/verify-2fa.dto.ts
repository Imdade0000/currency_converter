import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Verify2FaDto {
    @ApiProperty({ description: 'ID de l\'utilisateur' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ description: 'Code de vérification', example: '123456' })
    @IsString()
    @Length(6, 6)
    code: string;
}
