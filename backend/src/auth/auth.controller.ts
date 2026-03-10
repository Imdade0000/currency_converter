import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Verify2FaDto } from './dto/verify-2fa.dto';
import { Toggle2FaDto } from './dto/toggle-2fa.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('register')
    @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Public()
    @Post('login')
    @ApiOperation({ summary: 'Connexion utilisateur' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Public()
    @Post('forgot-password')
    @ApiOperation({ summary: 'Demander la réinitialisation du mot de passe' })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Public()
    @Post('reset-password')
    @ApiOperation({ summary: 'Réinitialiser le mot de passe avec un token' })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Public()
    @Post('verify-2fa')
    @ApiOperation({ summary: 'Vérifier le code 2FA envoyé par email' })
    async verify2Fa(@Body() verify2FaDto: Verify2FaDto) {
        return this.authService.verify2FaCode(verify2FaDto.userId, verify2FaDto.code);
    }

    @UseGuards(JwtAuthGuard)
    @Post('toggle-2fa')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Activer ou désactiver le 2FA' })
    async toggle2Fa(@Request() req, @Body() toggle2FaDto: Toggle2FaDto) {
        return this.authService.toggle2Fa(req.user.id, toggle2FaDto.enable);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtenir le profil de l\'utilisateur connecté' })
    async getProfile(@Request() req) {
        return this.authService.getProfile(req.user.id);
    }
}
