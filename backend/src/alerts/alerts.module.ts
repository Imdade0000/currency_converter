import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { AlertsCron } from './alerts.cron';
import { RatesModule } from '../rates/rates.module';
import { EmailModule } from '../email/email.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [RatesModule, EmailModule, NotificationsModule],
    controllers: [AlertsController],
    providers: [AlertsService, AlertsCron],
})
export class AlertsModule { }
