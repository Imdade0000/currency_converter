import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWaitingListDto } from './dto/create-waiting-list.dto';

@Injectable()
export class WaitingListService {
    constructor(private readonly prisma: PrismaService) { }

    async join(createWaitingListDto: CreateWaitingListDto) {
        const email = createWaitingListDto.email.trim().toLowerCase();
        const existingEntry = await this.prisma.waitingList.findUnique({
            where: { email },
        });

        if (existingEntry) {
            throw new ConflictException('This email is already on the waiting list');
        }

        return this.prisma.waitingList.create({
            data: { email },
        });
    }
}
