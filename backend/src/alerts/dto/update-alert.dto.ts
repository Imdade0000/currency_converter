import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAlertDto {
    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
