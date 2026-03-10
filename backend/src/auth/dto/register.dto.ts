import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'John Doe', description: 'Nom complet de l\'utilisateur' })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @ApiProperty({ example: 'john@example.com', description: 'Adresse email' })
    @IsEmail({}, { message: 'Veuillez fournir une adresse email valide' })
    email: string;

    @ApiProperty({ example: 'MotDePasse123!', description: 'Mot de passe (min 6 caractères)' })
    @IsString()
    @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
    @MaxLength(100)
    password: string;
}
