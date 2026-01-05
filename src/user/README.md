# User Module

Este módulo es responsable de la gestión de información detallada de los usuarios (Perfil).

## Estado Actual

### Rol en la Arquitectura
Actualmente actúa como un **Módulo de Soporte** para `Auth` y `Wallet`.
*   Provee validación de usuarios.
*   Conecta la identidad (Auth) con los datos del perfil (User).

### Capa de Dominio
*   **Entidad**: `User`.
*   **Unique Logic**: Cálculo de edad y tipo de usuario (`teen` vs `standard`) basado en `BirthDate`.
*   **Use Cases**:
    *   `FindUserUseCase`: Busca usuario por ID.

### Capa de Infraestructura
*   **Repository**: `PrismaUserRepository`.
    *   Implementa `upsert` para mantener sincronizados los usuarios.
    *   > [!NOTE]
    *   Como el Schema de base de datos actual no tiene campos como `birthDate` o `lastName`, este repositorio implementa **workarounds** (valores por defecto) o joins con la tabla `Account`.

## Endpoints
*   No expone endpoints públicos REST por el momento. Su funcionalidad es consumida internamente por otros módulos.

## Roadmap / Falta Implementar

1.  **Schema Alignment**:
    *   Actualizar tabla `User` en `schema.prisma` para incluir `birthDate`, `lastName`, etc.
    *   Eliminar workarounds en `PrismaUserRepository`.

2.  **CRUD**:
    *   Implementar `UpdateUserUseCase` (para cambiar nombre, fecha nacimiento, etc.).
    *   Exponer endpoints (`PUT /users/:id`).
