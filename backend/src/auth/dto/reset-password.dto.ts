import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({ description: 'Token de réinitialisation reçu par email' })
    @IsString()
    @IsNotEmpty({ message: 'Le token est requis' })
    token: string;

    @ApiProperty({ description: 'Nouveau mot de passe', minLength: 6 })
    @IsString()
    @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
    @IsNotEmpty({ message: 'Le nouveau mot de passe est requis' })
    newPassword: string;
}
