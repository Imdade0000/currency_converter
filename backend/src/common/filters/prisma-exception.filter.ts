import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(PrismaExceptionFilter.name);

    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Une erreur de base de données est survenue';

        switch (exception.code) {
            case 'P2002':
                status = HttpStatus.CONFLICT;
                const target = (exception.meta?.target as string[])?.join(', ') || 'champ';
                message = `Un enregistrement avec ce ${target} existe déjà`;
                break;
            case 'P2025':
                status = HttpStatus.NOT_FOUND;
                message = 'Enregistrement non trouvé';
                break;
            case 'P2003':
                status = HttpStatus.BAD_REQUEST;
                message = 'Violation de contrainte de clé étrangère';
                break;
            default:
                this.logger.error(`Prisma error code: ${exception.code}`, exception.message);
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            message,
        });
    }
}
