import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RatesModule } from './rates/rates.module';
import { ConversionModule } from './conversion/conversion.module';
import { AlertsModule } from './alerts/alerts.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { EmailModule } from './email/email.module';
import { PrismaModule } from './prisma/prisma.module';
import { WaitingListModule } from './waiting-list/waiting-list.module';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import emailConfig from './config/email.config';
import stripeConfig from './config/stripe.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env', 'backend/.env'],
            load: [databaseConfig, jwtConfig, emailConfig, stripeConfig],
        }),
        ScheduleModule.forRoot(),
        PrismaModule,
        AuthModule,
        UsersModule,
        RatesModule,
        ConversionModule,
        AlertsModule,
        ApiKeysModule,
        SubscriptionModule,
        EmailModule,
        WaitingListModule,
        AdminModule,
        NotificationsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
