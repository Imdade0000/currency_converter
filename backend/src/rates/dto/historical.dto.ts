import { IsString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HistoricalDto {
    @ApiProperty({ example: 'USD' })
    @IsString()
    from: string;

    @ApiProperty({ example: 'EUR' })
    @IsString()
    to: string;

    @ApiProperty({ example: 30 })
    @IsInt()
    @Min(1)
    @Max(365)
    days: number;
}
