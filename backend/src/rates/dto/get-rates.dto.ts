import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetRatesDto {
    @ApiProperty({ example: 'USD', description: 'Devise de base', required: false })
    @IsOptional()
    @IsString()
    base?: string;
}

export class GetHistoricalRatesDto {
    @ApiProperty({ example: 'USD', description: 'Devise source' })
    @IsString()
    from: string;

    @ApiProperty({ example: 'EUR', description: 'Devise cible' })
    @IsString()
    to: string;

    @ApiProperty({ example: 30, description: 'Nombre de jours', required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(365)
    days?: number;
}
