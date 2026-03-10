import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RatesService } from './rates.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Taux de change')
@Controller('rates')
export class RatesController {
    constructor(private ratesService: RatesService) { }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Obtenir les taux de change actuels' })
    @ApiQuery({ name: 'base', required: false, example: 'USD' })
    async getLatestRates(@Query('base') base: string = 'USD') {
        return this.ratesService.getLatestRates(base);
    }

    @Public()
    @Get('historical')
    @ApiOperation({ summary: 'Obtenir l\'historique des taux' })
    @ApiQuery({ name: 'from', required: true, example: 'USD' })
    @ApiQuery({ name: 'to', required: true, example: 'EUR' })
    @ApiQuery({ name: 'days', required: false, example: 30 })
    async getHistoricalRates(
        @Query('from') from: string,
        @Query('to') to: string,
        @Query('days') days: string = '30',
    ) {
        return this.ratesService.getHistoricalRates(from, to, parseInt(days, 10));
    }

    @Public()
    @Get('currencies')
    @ApiOperation({ summary: 'Obtenir la liste des devises supportées' })
    async getSupportedCurrencies() {
        return this.ratesService.getSupportedCurrencies();
    }
}
