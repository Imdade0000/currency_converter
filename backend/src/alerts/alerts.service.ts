import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';

@Injectable()
export class AlertsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createAlertDto: CreateAlertDto) {
        return this.prisma.alert.create({
            data: {
                userId,
                ...createAlertDto,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.alert.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string) {
        const alert = await this.prisma.alert.findFirst({
            where: { id, userId },
        });

        if (!alert) {
            throw new NotFoundException('Alerte non trouvée');
        }

        return alert;
    }

    async update(id: string, userId: string, updateAlertDto: UpdateAlertDto) {
        await this.findOne(id, userId);

        return this.prisma.alert.update({
            where: { id },
            data: updateAlertDto,
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId);

        return this.prisma.alert.delete({
            where: { id },
        });
    }

    async findActiveAlerts() {
        return this.prisma.alert.findMany({
            where: { active: true },
        });
    }

    async markAsTriggered(id: string) {
        return this.prisma.alert.update({
            where: { id },
            data: { 
                lastTriggered: new Date(),
                active: false // Option 1 : Désactive l'alerte après le premier envoi
            },
        });
    }
}
