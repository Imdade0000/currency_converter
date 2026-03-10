import { ApiProperty } from '@nestjs/swagger';

export class ConversionResponseDto {
    @ApiProperty({ example: 'USD' })
    from: string;

    @ApiProperty({ example: 'EUR' })
    to: string;

    @ApiProperty({ example: 100 })
    amount: number;

    @ApiProperty({ example: 92.15 })
    result: number;

    @ApiProperty({ example: 0.9215 })
    rate: number;

    @ApiProperty()
    timestamp: string;
}
