import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async createForUser(userId: string, payload: { type: string; title: string; message: string; metadata?: string }) {
        return this.prisma.notification.create({
            data: {
                userId,
                type: payload.type,
                title: payload.title,
                message: payload.message,
                metadata: payload.metadata,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }

    async getUnreadCount(userId: string) {
        const count = await this.prisma.notification.count({
            where: {
                userId,
                readAt: null,
            },
        });

        return { count };
    }

    async markAsRead(userId: string, id: string) {
        const notification = await this.prisma.notification.findFirst({
            where: { id, userId },
        });

        if (!notification) {
            throw new NotFoundException('Notification non trouvée');
        }

        if (notification.readAt) {
            return notification;
        }

        return this.prisma.notification.update({
            where: { id },
            data: { readAt: new Date() },
        });
    }

    async markAllAsRead(userId: string) {
        const result = await this.prisma.notification.updateMany({
            where: {
                userId,
                readAt: null,
            },
            data: {
                readAt: new Date(),
            },
        });

        return { updated: result.count };
    }
}
