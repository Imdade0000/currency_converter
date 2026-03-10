import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RatesService } from './rates.service';

@Injectable()
export class RatesCron {
    private readonly logger = new Logger(RatesCron.name);

    constructor(private ratesService: RatesService) { }

    @Cron(CronExpression.EVERY_6_HOURS)
    async updateRates() {
        if (process.env.ENABLE_RATE_UPDATES !== 'true') {
            return;
        }

        this.logger.log('Debut de la mise a jour automatique des taux...');

        const baseCurrencies = ['USD', 'EUR', 'GBP', 'XOF', 'NGN'];

        for (const base of baseCurrencies) {
            try {
                await this.ratesService.syncLatestRatesFromApi(base);
                this.logger.log(`Taux mis a jour pour ${base}`);
            } catch (error) {
                this.logger.error(`Erreur mise a jour ${base}: ${error.message}`);
            }

            // Pause between requests to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        this.logger.log('Mise a jour automatique des taux terminee');
    }
}
