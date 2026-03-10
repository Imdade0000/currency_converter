import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@xchange.com' },
        update: {},
        create: {
            email: 'admin@xchange.com',
            password: adminPassword,
            name: 'Admin XChange',
            isPremium: true,
        },
    });

    console.log({ admin });

    // Create some initial currencies if needed (though rates module handles this)

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
