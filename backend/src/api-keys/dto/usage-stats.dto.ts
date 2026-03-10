import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UsageStatsDto {
    @ApiProperty({ example: '30days', enum: ['24h', '7days', '30days'] })
    @IsString()
    period: string;
}
