import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  // Se ejecuta cuando arranca la App
  async onModuleInit() {
    await this.$connect();
  }

  // Se ejecuta cuando se apaga la App (evita fugas de memoria)
  async onModuleDestroy() {
    await this.$disconnect();
  }
}