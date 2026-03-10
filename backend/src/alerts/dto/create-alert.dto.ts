import { IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlertDto {
    @ApiProperty({ example: 'USD', description: 'Devise source' })
    @IsString()
    fromCurrency: string;

    @ApiProperty({ example: 'EUR', description: 'Devise cible' })
    @IsString()
    toCurrency: string;

    @ApiProperty({ example: 0.95, description: 'Taux cible à surveiller' })
    @IsNumber()
    @Min(0)
    targetRate: number;

    @ApiProperty({ example: 'above', enum: ['above', 'below'], description: 'Condition de déclenchement' })
    @IsEnum(['above', 'below'])
    condition: 'above' | 'below';
}
