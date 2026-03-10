import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConvertDto {
    @ApiProperty({ example: 'USD', description: 'Devise source' })
    @IsString()
    from: string;

    @ApiProperty({ example: 'EUR', description: 'Devise cible' })
    @IsString()
    to: string;

    @ApiProperty({ example: 100, description: 'Montant à convertir' })
    @IsNumber()
    @Min(0.01, { message: 'Le montant doit être supérieur à 0' })
    amount: number;
}
