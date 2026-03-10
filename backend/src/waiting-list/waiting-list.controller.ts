import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WaitingListService } from './waiting-list.service';
import { CreateWaitingListDto } from './dto/create-waiting-list.dto';

@ApiTags('Waiting List')
@Controller('waiting-list')
export class WaitingListController {
    constructor(private readonly waitingListService: WaitingListService) { }

    @Post()
    @ApiOperation({ summary: 'Join the premium waiting list' })
    join(@Body() createWaitingListDto: CreateWaitingListDto) {
        return this.waitingListService.join(createWaitingListDto);
    }
}
