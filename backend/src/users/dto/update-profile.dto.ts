import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiProperty({ example: 'John Doe', required: false })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name?: string;

    @ApiProperty({ example: 'NouveauMotDePasse123!', required: false })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}
