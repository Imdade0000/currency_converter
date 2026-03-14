import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RatesService } from './rates.service';
import { ApiKeysService } from '../api-keys/api-keys.service';

@Injectable()
export class RatesCron {
    private readonly logger = new Logger(RatesCron.name);

    constructor(
        private ratesService: RatesService,
        private apiKeysService: ApiKeysService,
    ) { }

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

    @Cron('0 0 1 * *') // 1er du mois à minuit
    async resetMonthlyQuotas() {
        this.logger.log('Debut de la reinitialisation mensuelle des quotas API...');
        try {
            await this.apiKeysService.resetAllRequestCounts();
            this.logger.log('Quotas API reinitialises avec succes.');
        } catch (error) {
            this.logger.error(`Erreur lors de la reinitialisation des quotas API: ${error.message}`);
        }
    }
}
