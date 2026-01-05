# Wallet MVP Microservice

Este proyecto es el microservicio principal (**Core Domain**) de una billetera digital enfocada en educación financiera para adolescentes. Gestiona la creación de cuentas, saldos, depósitos y retiros.

## Arquitectura

El proyecto sigue una arquitectura **Hexagonal (Ports and Adapters)** combinada con **Domain-Driven Design (DDD)** para aislar la lógica de negocio de la infraestructura.

### Estructura de Directorios
*   `src/wallet`: Módulo principal (Agregado Wallet).
*   `src/auth`: Módulo de Identidad y Acceso (Login/Register).
*   `src/user`: Módulo de Perfil de Usuario (Soporte).
*   `src/shared`: Kernel compartido (Value Objects, Clases Base).

Cada módulo tiene su propia estructura interna:
*   **Domain**: Entidades, Value Objects, Eventos de Dominio, Interfaces de Repositorio.
*   **Application**: Casos de Uso (Use Cases), DTOs.
*   **Infrastructure**: Implementaciones de Repositorios (Prisma, In-Memory), Controllers (REST API).

## Stack Tecnológico

*   **Framework**: [NestJS](https://nestjs.com/) (Node.js/TypeScript).
*   **Database ORM**: [Prisma](https://www.prisma.io/).
*   **Testing**: Jest (Unit & E2E).
*   **Package Manager**: Yarn.

## Módulos y Funcionalidades

### 1. Wallet Module
El corazón del sistema. Maneja el dinero.
*   **Features**: Crear Billetera (Standard/Teen), Depositar, Retirar, Consultar Saldo.
*   **Eventos**: Emite `MoneyDepositedEvent` y `MoneyWithdrawnEvent` (actualmente locales).

### 2. Auth Module
Maneja el registro y login.
*   **Features**: Registro de Usuario, Login (devuelve Token).
*   **Nota**: Actualmente usa implementaciones "Fake" para hasher y tokens (MVP).

### 3. User Module
Maneja datos del perfil.
*   **Features**: Búsqueda por ID, lógica de edad (`isTeen`).

## Instalación y Ejecución

```bash
# Instalación de dependencias
$ yarn install

# Levantar base de datos (si usas Docker localmente para Postgres)
# $ docker-compose up -d db

# Ejecutar migraciones de Prisma
$ yarn prisma migrate dev

# Iniciar servidor en modo desarrollo
$ yarn start:dev
```

## Testing

```bash
# Unit tests
$ yarn test

# E2E tests
$ yarn test:e2e
```

## Roadmap y Futuro (Microservicios)

Este repositorio es solo el comienzo. La arquitectura está diseñada para evolucionar hacia un sistema de **Microservicios distribuidos**.

### Próximos Pasos:

1.  **Event Driven Architecture (RabbitMQ)**
    *   Implementar un **Event Bus** (RabbitMQ/Kafka) para publicar los eventos de dominio (`MoneyDeposited`, `MoneyWithdrawn`) fuera de este servicio.

2.  **Transaction History Service (Nuevo Microservicio)**
    *   Crear un servicio separado dedicado exclusivamente a escuchar los eventos y guardar el historial de transacciones (Logs, Auditoría) en una base de datos optimizada para lectura (CQRS).

3.  **API Gateway**
    *   Implementar un Gateway para unificar la entrada a los distintos microservicios (`Wallet Core`, `Transactions`, `Notifications`).

4.  **Containerización**
    *   Orquestar todo el ecosistema con **Docker Compose** para desarrollo local fácil.
