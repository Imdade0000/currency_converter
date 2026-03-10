import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException('Un compte avec cet email existe déjà');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                password: hashedPassword,
                name: registerDto.name,
            },
        });

        const { password: _, ...userWithoutPassword } = user;
        const token = this.generateToken(user.id, user.email);

        // Envoyer l'email de bienvenue
        try {
            await this.emailService.sendWelcomeEmail(user.email, user.name);
        } catch (error) {
            this.logger.warn(`Impossible d'envoyer l'email de bienvenue à ${user.email}: ${error.message}`);
        }

        return {
            token,
            user: userWithoutPassword,
        };
    }

    async login(loginDto: LoginDto) {
        // Obtenir le user sans le MDP
        const user = await this.validateUser(loginDto.email, loginDto.password);

        if (!user) {
            throw new UnauthorizedException('Email ou mot de passe incorrect');
        }

        if (user.isTwoFactorEnabled) {
            // Générer un code à 6 chiffres
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    twoFactorEmailCode: code,
                    twoFactorEmailExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
                }
            });

            this.logger.log(`[2FA] Auth code généré pour ${user.email} (Envoi par email simulé)`);
            try {
                await this.emailService.send2FaCodeEmail(user.email, user.name, code);
            } catch (error) {
                this.logger.error(`Erreur d'envoi de l'email 2FA : ${error.message}`);
            }

            return { requires2FA: true, userId: user.id, message: 'Un code de vérification a été envoyé par email.' };
        }

        const token = this.generateToken(user.id, user.email);
        const { twoFactorEmailCode: _, twoFactorEmailExpires: __, ...userWithoutSecrets } = user;

        return {
            token,
            user: userWithoutSecrets,
        };
    }

    async verify2FaCode(userId: string, code: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new UnauthorizedException('Utilisateur introuvable');
        }

        if (
            !user.twoFactorEmailCode ||
            user.twoFactorEmailCode !== code ||
            !user.twoFactorEmailExpires ||
            user.twoFactorEmailExpires < new Date()
        ) {
            throw new UnauthorizedException('Code de vérification invalide ou expiré');
        }

        // Effacer le code maintenant qu'il a été utilisé
        await this.prisma.user.update({
            where: { id: user.id },
            data: { twoFactorEmailCode: null, twoFactorEmailExpires: null }
        });

        const token = this.generateToken(user.id, user.email);
        const { password: _, twoFactorEmailCode: __, twoFactorEmailExpires: ___, ...userWithoutSecrets } = user;

        return { token, user: userWithoutSecrets };
    }

    async toggle2Fa(userId: string, enable: boolean) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { isTwoFactorEnabled: enable, twoFactorEmailCode: null, twoFactorEmailExpires: null }
        });
        const { password: _, twoFactorEmailCode: __, twoFactorEmailExpires: ___, ...userWithoutSecrets } = user;
        return userWithoutSecrets;
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: forgotPasswordDto.email },
        });

        // Toujours retourner un succès pour ne pas révéler l'existence d'un compte
        if (!user) {
            return { message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' };
        }

        // Invalider les anciens tokens
        await this.prisma.passwordResetToken.updateMany({
            where: { userId: user.id, used: false },
            data: { used: true },
        });

        // Créer un nouveau token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

        await this.prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt,
            },
        });

        // Envoyer l'email
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
        try {
            await this.emailService.sendResetPasswordEmail(user.email, user.name, resetLink);
        } catch (error) {
            this.logger.error(`Erreur lors de l'envoi de l'email de réinitialisation: ${error.message}`);
        }

        return { message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const resetToken = await this.prisma.passwordResetToken.findFirst({
            where: {
                token: resetPasswordDto.token,
                used: false,
                expiresAt: { gt: new Date() },
            },
        });

        if (!resetToken) {
            throw new BadRequestException('Le lien de réinitialisation est invalide ou a expiré.');
        }

        const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

        // Mettre à jour le mot de passe
        await this.prisma.user.update({
            where: { id: resetToken.userId },
            data: { password: hashedPassword },
        });

        // Marquer le token comme utilisé
        await this.prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { used: true },
        });

        return { message: 'Votre mot de passe a été réinitialisé avec succès.' };
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('Utilisateur non trouvé');
        }

        const { password: _, ...result } = user;
        return result;
    }

    private generateToken(userId: string, email: string): string {
        const payload = { sub: userId, email };
        return this.jwtService.sign(payload);
    }
}
