import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatesService {
    private readonly logger = new Logger(RatesService.name);

    constructor(private prisma: PrismaService) { }

    async getLatestRates(base: string = 'USD'): Promise<{ base: string; rates: Record<string, number>; timestamp: string }> {
        const dbRates = await this.getLatestFromDb(base);
        if (dbRates) {
            return dbRates;
        }

        this.logger.warn(`Aucun taux en DB pour ${base}, tentative de synchronisation en temps réel...`);
        return this.syncLatestRatesFromApi(base);
    }

    async syncLatestRatesFromApi(base: string = 'USD'): Promise<{ base: string; rates: Record<string, number>; timestamp: string }> {
        try {
            const apiKey = process.env.EXCHANGE_RATE_API_KEY;
            const apiUrl = process.env.EXCHANGE_RATE_API_URL || 'https://v6.exchangerate-api.com/v6';

            const response = await axios.get(`${apiUrl}/${apiKey}/latest/${base}`);

            if (response.data.result === 'success') {
                const rates = response.data.conversion_rates;

                // Store in database for serving requests locally
                await this.storeRates(base, rates);

                return {
                    base,
                    rates,
                    timestamp: new Date().toISOString(),
                };
            }

            throw new HttpException('Erreur lors de la recuperation des taux', HttpStatus.BAD_GATEWAY);
        } catch (error) {
            this.logger.error(`Erreur API taux de change: ${error.message}`);

            throw new HttpException(
                `Echec de synchronisation des taux externes pour ${base}`,
                HttpStatus.BAD_GATEWAY,
            );
        }
    }

    async getHistoricalRates(from: string, to: string, days: number = 30) {
        const dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - days);

        const rates = await this.prisma.exchangeRate.findMany({
            where: {
                base: from,
                currency: to,
                date: { gte: dateFrom },
            },
            orderBy: { date: 'asc' },
            select: {
                rate: true,
                date: true,
            },
        });

        return rates.map((r) => ({
            date: r.date.toISOString().split('T')[0],
            rate: r.rate,
        }));
    }

    async getSupportedCurrencies(): Promise<string[]> {
        const [bases, quotes] = await Promise.all([
            this.prisma.exchangeRate.findMany({
                select: { base: true },
                distinct: ['base'],
            }),
            this.prisma.exchangeRate.findMany({
                select: { currency: true },
                distinct: ['currency'],
            }),
        ]);

        const dbCurrencies = new Set<string>();
        bases.forEach((b) => dbCurrencies.add(b.base));
        quotes.forEach((q) => dbCurrencies.add(q.currency));

        if (dbCurrencies.size > 0) {
            return Array.from(dbCurrencies).sort();
        }

        // Fallback list
        return ['USD', 'EUR', 'GBP', 'XOF', 'XAF', 'NGN', 'GHS', 'JPY', 'CNY', 'CAD'];
    }

    private async storeRates(base: string, rates: Record<string, number>) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const operations = Object.entries(rates).map(([currency, rate]) =>
            this.prisma.exchangeRate.upsert({
                where: {
                    base_currency_date: { base, currency, date: today },
                },
                update: { rate },
                create: { base, currency, rate, date: today },
            }),
        );

        try {
            await this.prisma.$transaction(operations);
            this.logger.log(`Taux stockes pour ${base}: ${Object.keys(rates).length} devises`);
        } catch (error) {
            this.logger.error(`Erreur stockage taux: ${error.message}`);
        }
    }

    private async getLatestFromDb(base: string) {
        const lastEntry = await this.prisma.exchangeRate.findFirst({
            where: { base },
            orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
            select: { date: true },
        });

        if (!lastEntry) return null;

        const latestRates = await this.prisma.exchangeRate.findMany({
            where: {
                base,
                date: lastEntry.date,
            },
            orderBy: { currency: 'asc' },
            select: {
                currency: true,
                rate: true,
                date: true,
            },
        });

        const rates: Record<string, number> = {};
        latestRates.forEach((r) => {
            rates[r.currency] = r.rate;
        });

        return {
            base,
            rates,
            timestamp: latestRates[0].date.toISOString(),
        };
    }
}
