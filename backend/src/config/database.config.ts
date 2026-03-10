import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    url: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/currency_converter',
}));
