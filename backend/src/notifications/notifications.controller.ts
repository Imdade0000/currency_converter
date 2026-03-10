import { Controller, Get, Patch, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    @ApiOperation({ summary: 'Lister les notifications de l\'utilisateur' })
    findAll(@Request() req) {
        return this.notificationsService.findAll(req.user.id);
    }

    @Get('unread-count')
    @ApiOperation({ summary: 'Compter les notifications non lues' })
    getUnreadCount(@Request() req) {
        return this.notificationsService.getUnreadCount(req.user.id);
    }

    @Patch(':id/read')
    @ApiOperation({ summary: 'Marquer une notification comme lue' })
    markAsRead(@Request() req, @Param('id') id: string) {
        return this.notificationsService.markAsRead(req.user.id, id);
    }

    @Patch('read-all')
    @ApiOperation({ summary: 'Marquer toutes les notifications comme lues' })
    markAllAsRead(@Request() req) {
        return this.notificationsService.markAllAsRead(req.user.id);
    }
}
