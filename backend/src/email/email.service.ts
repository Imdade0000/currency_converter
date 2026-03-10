import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name);
    private readonly smtpUser: string;
    private readonly smtpPassword: string;

    constructor(private configService: ConfigService) {
        this.smtpUser = this.configService.get<string>('email.user') || '';
        this.smtpPassword = this.configService.get<string>('email.password') || '';

        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('email.host'),
            port: this.configService.get<number>('email.port'),
            secure: this.configService.get<number>('email.port') === 465,
            auth: {
                user: this.smtpUser,
                pass: this.smtpPassword,
            },
        });
    }

    private hasValidSmtpConfig(): boolean {
        const invalidUser = !this.smtpUser || this.smtpUser.includes('votre-email');
        const invalidPassword = !this.smtpPassword || this.smtpPassword.includes('votre-mot-de-passe');
        return !invalidUser && !invalidPassword;
    }

    private resolveTemplatePath(templateName: string): string | null {
        const distPath = path.join(__dirname, 'templates', `${templateName}.hbs`);
        if (fs.existsSync(distPath)) {
            return distPath;
        }

        const srcPath = path.join(process.cwd(), 'src', 'email', 'templates', `${templateName}.hbs`);
        if (fs.existsSync(srcPath)) {
            return srcPath;
        }

        return null;
    }

    private async sendMail(to: string, subject: string, templateName: string, context: any) {
        try {
            if (!this.hasValidSmtpConfig()) {
                this.logger.warn(
                    `Envoi email ignoré pour ${to}: configuration SMTP invalide. Configurez SMTP_USER et SMTP_PASSWORD avec un App Password Gmail.`,
                );
                return;
            }

            const templatePath = this.resolveTemplatePath(templateName);
            let html = '';

            if (templatePath) {
                const templateSource = fs.readFileSync(templatePath, 'utf8');
                const template = handlebars.compile(templateSource);
                html = template(context);
            } else {
                html = `<h1>${subject}</h1><p>${JSON.stringify(context)}</p>`;
                this.logger.warn(`Template introuvable (${templateName}.hbs). Fallback HTML minimal utilisé.`);
            }

            await this.transporter.sendMail({
                from: this.configService.get<string>('email.from'),
                to,
                subject,
                html,
            });

            this.logger.log(`Email envoyé à ${to} avec le sujet: ${subject}`);
        } catch (error) {
            this.logger.error(`Erreur lors de l'envoi de l'email à ${to}: ${error.message}`);
        }
    }

    async sendWelcomeEmail(to: string, name: string) {
        await this.sendMail(to, 'Bienvenue sur XChange !', 'welcome', { name });
    }

    async sendAlertEmail(to: string, alertData: any) {
        const subject = `Alerte Taux : ${alertData.fromCurrency}/${alertData.toCurrency}`;
        await this.sendMail(to, subject, 'alert', alertData);
    }

    async sendPremiumConfirmation(to: string, name: string) {
        await this.sendMail(to, 'Bienvenue au Club Premium XChange !', 'premium', { name });
    }

    async sendResetPasswordEmail(to: string, name: string, resetLink: string) {
        await this.sendMail(to, 'Réinitialisation de votre mot de passe - XChange', 'reset-password', { name, resetLink });
    }

    async send2FaCodeEmail(to: string, name: string, code: string) {
        await this.sendMail(to, 'Votre code de connexion 2FA - XChange', '2fa-code', { name, code });
    }
}
