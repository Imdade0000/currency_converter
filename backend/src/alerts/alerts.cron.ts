import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AlertsService } from './alerts.service';
import { RatesService } from '../rates/rates.service';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AlertsCron {
    private readonly logger = new Logger(AlertsCron.name);

    constructor(
        private alertsService: AlertsService,
        private ratesService: RatesService,
        private emailService: EmailService,
        private notificationsService: NotificationsService,
    ) { }

    @Cron(CronExpression.EVERY_HOUR)
    async checkAlerts() {
        this.logger.log('Vérification des alertes de taux...');

        const activeAlerts = await this.alertsService.findActiveAlerts();
        if (activeAlerts.length === 0) return;

        // Get current rates for all required base currencies
        const baseCurrencies = [...new Set(activeAlerts.map(a => a.fromCurrency))];
        const ratesMap = new Map();

        for (const base of baseCurrencies) {
            try {
                const data = await this.ratesService.getLatestRates(base);
                ratesMap.set(base, data.rates);
            } catch (error) {
                this.logger.error(`Impossible de récupérer les taux pour ${base}: ${error.message}`);
            }
        }

        for (const alert of activeAlerts) {
            const currentRates = ratesMap.get(alert.fromCurrency);
            if (!currentRates) continue;

            const currentRate = currentRates[alert.toCurrency];
            if (!currentRate) continue;

            let triggered = false;
            if (alert.condition === 'above' && currentRate >= alert.targetRate) {
                triggered = true;
            } else if (alert.condition === 'below' && currentRate <= alert.targetRate) {
                triggered = true;
            }

            if (triggered) {
                this.logger.log(`Alerte déclenchée pour l'utilisateur ${alert.userId}: ${alert.fromCurrency}/${alert.toCurrency} at ${currentRate}`);

                // Mark as triggered to avoid constant spam (could also deactivate or have a cooldown)
                await this.alertsService.markAsTriggered(alert.id);

                // Send Email
                const user = await (this.alertsService as any).prisma.user.findUnique({ where: { id: alert.userId } });
                if (user) {
                    await this.notificationsService.createForUser(alert.userId, {
                        type: 'rate_alert_triggered',
                        title: `Alerte ${alert.fromCurrency}/${alert.toCurrency}`,
                        message: `Votre alerte ${alert.condition === 'above' ? 'au-dessus' : 'en dessous'} de ${alert.targetRate} est déclenchée. Taux actuel: ${currentRate}.`,
                        metadata: JSON.stringify({
                            alertId: alert.id,
                            fromCurrency: alert.fromCurrency,
                            toCurrency: alert.toCurrency,
                            targetRate: alert.targetRate,
                            currentRate,
                            condition: alert.condition,
                        }),
                    });

                    await this.emailService.sendAlertEmail(user.email, {
                        userName: user.name,
                        fromCurrency: alert.fromCurrency,
                        toCurrency: alert.toCurrency,
                        targetRate: alert.targetRate,
                        currentRate: currentRate,
                        condition: alert.condition
                    });
                }
            }
        }
    }
}
