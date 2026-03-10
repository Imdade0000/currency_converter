import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'john@example.com', description: 'Adresse email' })
    @IsEmail({}, { message: 'Veuillez fournir une adresse email valide' })
    email: string;

    @ApiProperty({ example: 'MotDePasse123!', description: 'Mot de passe' })
    @IsString()
    @MinLength(6)
    password: string;
}
