import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Se ejecuta cuando arranca la App
  async onModuleInit() {
    await this.$connect();
  }

  // Se ejecuta cuando se apaga la App (evita fugas de memoria)
  async onModuleDestroy() {
    await this.$disconnect();
  }
}