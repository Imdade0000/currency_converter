import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type DailyPoint = {
  date: string;
  signups: number;
  activeUsers: number;
  apiRequests: number;
};

type TopApiUser = {
  userId: string;
  name: string;
  email: string;
  requests: number;
};

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getSystemStats() {
    const now = new Date();
    const windowDays = 30;
    const startDate = this.startOfDayUtc(new Date(now.getTime() - (windowDays - 1) * 24 * 60 * 60 * 1000));

    const [
      totalUsers,
      premiumUsers,
      newUsersLast30Days,
      totalApiKeys,
      totalActiveApiKeys,
      totalApiRequestsLast30Days,
      activeUsersLast30Days,
      usersCreated,
      apiRequests,
      conversions,
      alerts,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isPremium: true } }),
      this.prisma.user.count({ where: { createdAt: { gte: startDate } } }),
      this.prisma.apiKey.count(),
      this.prisma.apiKey.count({ where: { active: true } }),
      this.prisma.apiRequest.count({ where: { createdAt: { gte: startDate } } }),
      this.prisma.user.count({
        where: {
          OR: [
            { conversions: { some: { createdAt: { gte: startDate } } } },
            { alerts: { some: { updatedAt: { gte: startDate } } } },
            { apiKeys: { some: { requests: { some: { createdAt: { gte: startDate } } } } } },
          ],
        },
      }),
      this.prisma.user.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      this.prisma.apiRequest.findMany({
        where: { createdAt: { gte: startDate } },
        select: {
          createdAt: true,
          apiKey: {
            select: {
              userId: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.conversion.findMany({
        where: { createdAt: { gte: startDate }, userId: { not: null } },
        select: { userId: true, createdAt: true },
      }),
      this.prisma.alert.findMany({
        where: { updatedAt: { gte: startDate } },
        select: { userId: true, updatedAt: true },
      }),
    ]);

    const dailySeries = this.buildDailySeries(windowDays, startDate, usersCreated, apiRequests, conversions, alerts);
    const topApiUsers = this.buildTopApiUsers(apiRequests);

    return {
      generatedAt: now.toISOString(),
      period: {
        activeUserWindowDays: windowDays,
      },
      users: {
        total: totalUsers,
        activeLast30Days: activeUsersLast30Days,
        newLast30Days: newUsersLast30Days,
        premium: premiumUsers,
      },
      api: {
        totalKeys: totalApiKeys,
        activeKeys: totalActiveApiKeys,
        requestsLast30Days: totalApiRequestsLast30Days,
      },
      dailySeries,
      topApiUsers,
    };
  }

  private buildDailySeries(
    windowDays: number,
    startDate: Date,
    usersCreated: Array<{ createdAt: Date }>,
    apiRequests: Array<{ createdAt: Date; apiKey: { userId: string; user: { id: string; name: string; email: string } } }>,
    conversions: Array<{ userId: string | null; createdAt: Date }>,
    alerts: Array<{ userId: string; updatedAt: Date }>,
  ): DailyPoint[] {
    const signupsByDay = new Map<string, number>();
    const apiRequestsByDay = new Map<string, number>();
    const activeUsersByDay = new Map<string, Set<string>>();

    usersCreated.forEach((u) => {
      const key = this.dateKeyUtc(u.createdAt);
      signupsByDay.set(key, (signupsByDay.get(key) || 0) + 1);
    });

    apiRequests.forEach((r) => {
      const key = this.dateKeyUtc(r.createdAt);
      apiRequestsByDay.set(key, (apiRequestsByDay.get(key) || 0) + 1);

      if (!activeUsersByDay.has(key)) activeUsersByDay.set(key, new Set<string>());
      activeUsersByDay.get(key)?.add(r.apiKey.userId);
    });

    conversions.forEach((c) => {
      if (!c.userId) return;
      const key = this.dateKeyUtc(c.createdAt);
      if (!activeUsersByDay.has(key)) activeUsersByDay.set(key, new Set<string>());
      activeUsersByDay.get(key)?.add(c.userId);
    });

    alerts.forEach((a) => {
      const key = this.dateKeyUtc(a.updatedAt);
      if (!activeUsersByDay.has(key)) activeUsersByDay.set(key, new Set<string>());
      activeUsersByDay.get(key)?.add(a.userId);
    });

    const points: DailyPoint[] = [];
    for (let i = 0; i < windowDays; i += 1) {
      const day = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const key = this.dateKeyUtc(day);
      points.push({
        date: key,
        signups: signupsByDay.get(key) || 0,
        activeUsers: activeUsersByDay.get(key)?.size || 0,
        apiRequests: apiRequestsByDay.get(key) || 0,
      });
    }

    return points;
  }

  private buildTopApiUsers(
    apiRequests: Array<{ createdAt: Date; apiKey: { userId: string; user: { id: string; name: string; email: string } } }>,
  ): TopApiUser[] {
    const aggregate = new Map<string, TopApiUser>();

    apiRequests.forEach((r) => {
      const user = r.apiKey.user;
      const current = aggregate.get(user.id);
      if (current) {
        current.requests += 1;
      } else {
        aggregate.set(user.id, {
          userId: user.id,
          name: user.name,
          email: user.email,
          requests: 1,
        });
      }
    });

    return Array.from(aggregate.values())
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10);
  }

  private startOfDayUtc(date: Date): Date {
    const copy = new Date(date);
    copy.setUTCHours(0, 0, 0, 0);
    return copy;
  }

  private dateKeyUtc(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
