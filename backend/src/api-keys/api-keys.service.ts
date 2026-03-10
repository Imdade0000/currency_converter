import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateKeyDto } from './dto/generate-key.dto';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
    constructor(private prisma: PrismaService) { }

    async generateKey(userId: string, generateKeyDto: GenerateKeyDto) {
        const key = `xc_${crypto.randomBytes(24).toString('hex')}`;

        // Set limit based on plan
        let limit = 100;
        switch (generateKeyDto.plan) {
            case 'starter': limit = 10000; break;
            case 'pro': limit = 100000; break;
            case 'business': limit = 1000000; break;
        }

        return this.prisma.apiKey.create({
            data: {
                userId,
                name: generateKeyDto.name,
                key,
                plan: generateKeyDto.plan,
                requestLimit: limit,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.apiKey.findMany({
            where: { userId },
            include: {
                _count: {
                    select: { requests: true }
                }
            }
        });
    }

    async revoke(id: string, userId: string) {
        return this.prisma.apiKey.delete({
            where: { id, userId },
        });
    }

    async validateKey(key: string) {
        const apiKey = await this.prisma.apiKey.findUnique({
            where: { key, active: true },
        });

        if (!apiKey) {
            throw new UnauthorizedException('Clé API invalide');
        }

        if (apiKey.requestCount >= apiKey.requestLimit) {
            throw new ForbiddenException('Limite de requêtes API atteinte pour ce plan');
        }

        // Increment request count
        await this.prisma.apiKey.update({
            where: { id: apiKey.id },
            data: { requestCount: { increment: 1 } },
        });

        return apiKey;
    }

    async logRequest(apiKeyId: string, details: { endpoint: string, method: string, statusCode: number, ipAddress?: string, userAgent?: string }) {
        return this.prisma.apiRequest.create({
            data: {
                apiKeyId,
                ...details,
            },
        });
    }
}
