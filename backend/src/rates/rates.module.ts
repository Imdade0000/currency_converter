import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { RatesCron } from './rates.cron';

@Module({
    controllers: [RatesController],
    providers: [RatesService, RatesCron],
    exports: [RatesService],
})
export class RatesModule { }
