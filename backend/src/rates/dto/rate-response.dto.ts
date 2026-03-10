import { ApiProperty } from '@nestjs/swagger';

export class RateResponseDto {
    @ApiProperty({ example: 'USD' })
    base: string;

    @ApiProperty({ example: { EUR: 0.92, GBP: 0.79, XOF: 605.5 } })
    rates: Record<string, number>;

    @ApiProperty()
    timestamp: string;
}
