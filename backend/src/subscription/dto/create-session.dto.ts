import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
    @ApiProperty({ example: 'price_123...' })
    @IsString()
    priceId: string;
}
