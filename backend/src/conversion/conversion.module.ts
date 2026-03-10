import { Module } from '@nestjs/common';
import { ConversionService } from './conversion.service';
import { ConversionController } from './conversion.controller';
import { RatesModule } from '../rates/rates.module';

@Module({
    imports: [RatesModule],
    controllers: [ConversionController],
    providers: [ConversionService],
    exports: [ConversionService],
})
export class ConversionModule { }
