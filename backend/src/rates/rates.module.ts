import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { RatesCron } from './rates.cron';
import { ApiKeysModule } from '../api-keys/api-keys.module';

@Module({
    imports: [ApiKeysModule],
    controllers: [RatesController],
    providers: [RatesService, RatesCron],
    exports: [RatesService],
})
export class RatesModule { }
