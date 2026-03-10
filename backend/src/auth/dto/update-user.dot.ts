import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'Nouveau nom', required: false })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name?: string;

    @ApiProperty({ example: 'NouveauMotDePasse123!', description: 'Nouveau mot de passe', required: false })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}
