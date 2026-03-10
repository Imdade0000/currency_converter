import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateFavoritesDto } from './dto/update-favorites.dto';

@ApiTags('Utilisateurs')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('profile')
    @ApiOperation({ summary: 'Obtenir le profil de l\'utilisateur' })
    async getProfile(@Request() req) {
        return this.usersService.findById(req.user.id);
    }

    @Patch('profile')
    @ApiOperation({ summary: 'Mettre à jour le profil' })
    async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
        return this.usersService.updateProfile(req.user.id, updateProfileDto);
    }

    @Patch('favorites')
    @ApiOperation({ summary: 'Mettre à jour les devises favorites' })
    async updateFavorites(@Request() req, @Body() updateFavoritesDto: UpdateFavoritesDto) {
        return this.usersService.updateFavorites(req.user.id, updateFavoritesDto);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Obtenir les statistiques de l\'utilisateur' })
    async getStats(@Request() req) {
        return this.usersService.getUserStats(req.user.id);
    }
}
