import { Module } from '@nestjs/common';
import { WaitingListController } from './waiting-list.controller';
import { WaitingListService } from './waiting-list.service';

@Module({
    controllers: [WaitingListController],
    providers: [WaitingListService],
})
export class WaitingListModule { }
