import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RatesService } from '../rates/rates.service';
import { ConvertDto } from './dto/convert.dto';

@Injectable()
export class ConversionService {
    private readonly logger = new Logger(ConversionService.name);

    constructor(
        private prisma: PrismaService,
        private ratesService: RatesService,
    ) { }

    async convert(convertDto: ConvertDto, userId?: string) {
        const { from, to, amount } = convertDto;

        // Get the current rates
        const ratesData = await this.ratesService.getLatestRates(from);
        const rate = ratesData.rates[to];

        if (!rate) {
            throw new Error(`Taux de change non disponible pour ${from} -> ${to}`);
        }

        const result = amount * rate;

        // Store conversion in database
        await this.prisma.conversion.create({
            data: {
                userId: userId || null,
                fromCurrency: from,
                toCurrency: to,
                amount,
                result,
                rate,
            },
        });

        return {
            from,
            to,
            amount,
            result: Math.round(result * 100) / 100,
            rate,
            timestamp: new Date().toISOString(),
        };
    }

    async getConversionHistory(userId: string, limit: number = 10) {
        return this.prisma.conversion.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }

    async getPopularConversions() {
        const conversions = await this.prisma.conversion.groupBy({
            by: ['fromCurrency', 'toCurrency'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10,
        });

        return conversions.map((c) => ({
            from: c.fromCurrency,
            to: c.toCurrency,
            count: c._count.id,
        }));
    }
}
