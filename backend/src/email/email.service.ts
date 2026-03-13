import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class EmailService {
    private resend: Resend | null = null;
    private readonly logger = new Logger(EmailService.name);
    private readonly fromAddress: string;
    private readonly apiKey: string;

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('RESEND_API_KEY') || '';
        this.fromAddress = this.configService.get<string>('EMAIL_FROM') || 'XChange <onboarding@resend.dev>';

        if (this.apiKey && !this.apiKey.includes('your_resend')) {
            this.resend = new Resend(this.apiKey);
            this.logger.log('Resend initialisé avec succès.');
        } else {
            this.logger.warn('RESEND_API_KEY non configurée — les emails ne seront pas envoyés.');
        }
    }

    private async sendMail(to: string, subject: string, templateName: string, context: any): Promise<void> {
        if (!this.resend) {
            this.logger.warn(`[Email ignoré] Destinataire: ${to} | Sujet: ${subject} | Context: ${JSON.stringify(context)}`);
            return;
        }

        let html = `<h1>${subject}</h1><pre>${JSON.stringify(context, null, 2)}</pre>`;

        try {
            const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
            if (fs.existsSync(templatePath)) {
                const templateSource = fs.readFileSync(templatePath, 'utf8');
                const template = handlebars.compile(templateSource);
                html = template(context);
            }
        } catch (err: any) {
            this.logger.warn(`Template "${templateName}.hbs" introuvable, fallback HTML utilisé.`);
        }

        try {
            const { data, error } = await this.resend.emails.send({
                from: this.fromAddress,
                to: [to],
                subject,
                html,
            });

            if (error) {
                this.logger.error(`Erreur Resend pour ${to}: ${JSON.stringify(error)}`);
                return;
            }

            this.logger.log(`Email envoyé via Resend à ${to} | ID: ${data?.id}`);
        } catch (error: any) {
            this.logger.error(`Erreur lors de l'envoi de l'email via Resend à ${to}: ${error.message}`);
        }
    }

    async sendWelcomeEmail(to: string, name: string): Promise<void> {
        await this.sendMail(to, 'Bienvenue sur XChange !', 'welcome', { name });
    }

    async sendAlertEmail(to: string, alertData: any): Promise<void> {
        const subject = `Alerte Taux : ${alertData.fromCurrency}/${alertData.toCurrency}`;
        await this.sendMail(to, subject, 'alert', alertData);
    }

    async sendPremiumConfirmation(to: string, name: string): Promise<void> {
        await this.sendMail(to, 'Bienvenue au Club Premium XChange !', 'premium', { name });
    }

    async sendResetPasswordEmail(to: string, name: string, resetLink: string): Promise<void> {
        await this.sendMail(to, 'Réinitialisation de votre mot de passe - XChange', 'reset-password', { name, resetLink });
    }

    async send2FaCodeEmail(to: string, name: string, code: string): Promise<void> {
        // Log du code en cas d'échec SMTP pour faciliter le debug
        this.logger.log(`[2FA DEBUG] Code généré pour ${to}: ${code}`);
        await this.sendMail(to, 'Votre code de connexion 2FA - XChange', '2fa-code', { name, code });
    }
}
