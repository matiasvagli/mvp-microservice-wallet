import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
    try {
        console.log('Intentando inicializar PrismaClient con Adapter PostgreSQL...');

        // Simular lo que hace el PrismaService
        const connectionString = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/wallet_db";
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        const prisma = new PrismaClient({ adapter });

        console.log('Inicializado correctamente.');
        await prisma.$connect();
        console.log('Conexión OK.');

        await prisma.$disconnect();
        await pool.end();
    } catch (e) {
        console.error('Error al inicializar:', e);
        process.exit(1);
    }
}

main();
