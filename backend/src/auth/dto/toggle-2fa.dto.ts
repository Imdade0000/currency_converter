import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Toggle2FaDto {
    @ApiProperty({ description: 'Activer ou désactiver le 2FA' })
    @IsBoolean()
    @IsNotEmpty()
    enable: boolean;
}
