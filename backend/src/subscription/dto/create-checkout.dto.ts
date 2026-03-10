import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutDto {
    @ApiProperty({ example: 'price_id_123' })
    @IsString()
    @IsNotEmpty()
    priceId: string;
}
