import { IsString, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateKeyDto {
    @ApiProperty({ example: 'Mon Appli E-commerce' })
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name: string;

    @ApiProperty({ example: 'free', enum: ['free', 'starter', 'pro', 'business'] })
    @IsEnum(['free', 'starter', 'pro', 'business'])
    plan: string;
}
