import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        let dbUrl = process.env.DATABASE_URL;

        if (dbUrl && !dbUrl.includes('connection_limit')) {
            const separator = dbUrl.includes('?') ? '&' : '?';
            dbUrl = `${dbUrl}${separator}connection_limit=3&pool_timeout=10`;
        }

        super({
            datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
            log: ['warn', 'error'],
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
