# Wallet Module

Este módulo maneja la lógica de negocio principal de las billeteras (Wallets).

## Estado Actual

### Capa de Dominio
*   **Agregado Root**: `Wallet`.
*   **Value Objects**: `Money`, `Currency`, `WalletType`, `UUID`.
*   **Lógica**:
    *   `createStandard`: Crea billetera común.
    *   `createTeen`: Crea billetera para adolescentes (requiere padre).
    *   `deposit`: Ingresa dinero y genera evento `MoneyDepositedEvent`.
    *   `withdraw`: Retira dinero y genera evento `MoneyWithdrawnEvent`.

### Capa de Aplicación (Use Cases)
*   **CreateWalletUseCase**: Crea billeteras validando reglas de negocio.
*   **DepositMoneyUseCase**: Orquesta el depósito.
*   **WithdrawWalletUseCase**: Orquesta el retiro.
*   **GetWalletUseCase**: Recupera información de la billetera.

### Capa de Infraestructura (API)
*   **Controller**: `WalletController` (`/wallets`).
*   **Repository**: `PrismaWalletRepository` (Persistencia en DB PostgreSQL vía Prisma).

## Endpoints

| Método | Ruta | Descripción | Body/Params |
| :--- | :--- | :--- | :--- |
| `POST` | `/wallets` | Crea una nueva Wallet | `{ ownerId: string, currencyCode: string, type?: 'teen'|'standard', parentWalletId?: string }` |
| `GET` | `/wallets/:id` | Obtiene saldo y detalles | `id` (Param) |
| `POST` | `/wallets/:id/deposit` | Deposita dinero | `{ amount: number, currency: string, ownerId: string }` |
| `POST` | `/wallets/:id/withdraw` | Retira dinero | `{ amount: number, currency: string }` |

## Roadmap / Falta Implementar

1.  **Event Bus (RabbitMQ)**:
    *   Actualmente los eventos `MoneyDeposited` y `MoneyWithdrawn` se quedan en memoria o logs.
    *   **Futuro**: Publicar estos eventos en un Exchange de RabbitMQ para que otros microservicios (como `Transactions` o `Notifications`) los consuman.

2.  **Transaction History**:
    *   Este módulo **NO** guarda el historial de transacciones. Solo guarda el estado actual (saldo).
    *   **Futuro**: Un servicio externo (`Transaction Service`) escuchará los eventos y los guardará en un `Event Store` o base de datos de historial.

3.  **Transferencias**:
    *   Falta lógica para mover dinero entre dos billeteras (Transferencia).
