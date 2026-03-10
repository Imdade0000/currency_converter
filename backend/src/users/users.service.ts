import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateFavoritesDto } from './dto/update-favorites.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findById(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        const { password, ...result } = user;
        return result;
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        const data: any = {};

        if (updateProfileDto.name) {
            data.name = updateProfileDto.name;
        }

        if (updateProfileDto.password) {
            data.password = await bcrypt.hash(updateProfileDto.password, 10);
        }

        const user = await this.prisma.user.update({
            where: { id: userId },
            data,
        });

        const { password, ...result } = user;
        return result;
    }

    async updateFavorites(userId: string, updateFavoritesDto: UpdateFavoritesDto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                favoriteCurrencies: JSON.stringify(updateFavoritesDto.currencies),
            },
        });

        const { password, ...result } = user;
        return {
            ...result,
            favoriteCurrencies: updateFavoritesDto.currencies,
        };
    }

    async getUserStats(userId: string) {
        const [conversions, alerts, apiKeys] = await Promise.all([
            this.prisma.conversion.count({ where: { userId } }),
            this.prisma.alert.count({ where: { userId } }),
            this.prisma.apiKey.count({ where: { userId } }),
        ]);

        return {
            totalConversions: conversions,
            totalAlerts: alerts,
            totalApiKeys: apiKeys,
        };
    }
}
