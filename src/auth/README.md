# Auth Module

Este módulo gestiona la identidad de los usuarios y la emisión de tokens de acceso.

## Estado Actual

### Capa de Dominio
*   **Entidad**: `AuthUser`.
*   **Value Objects**: `UserId`, `UserPassword` (valida longitud y formato).
*   **Interfaces**: `AuthUserRepository`, `PasswordHasher`, `ITokenService`.

### Capa de Aplicación (Use Cases)
*   **RegisterUseCase**:
    1. Verifica si el email ya existe.
    2. Valida password.
    3. Hashea password.
    4. Guarda usuario.
*   **LoginUseCase**:
    1. Busca usuario por email.
    2. Valida password (hash compare).
    3. Genera token de acceso.

### Capa de Infraestructura (Implementación Fake/Mock)
> [!WARNING]
> Actualmente este módulo utiliza implementaciones en memoria o fake para facilitar el desarrollo inicial. NO ESTÁ LISTO PARA PRODUCCIÓN.

*   **Repository**: `InMemoryAuthRepository` (Los usuarios se pierden al reiniciar).
*   **Hasher**: `FakePasswordHasher` (Simula hash pero no es seguro).
*   **Token**: `FakeTokenService` (Genera strings aleatorios, no JWT reales).
*   **Controller**: `AuthController` (`/auth`).

## Endpoints

| Método | Ruta | Descripción | Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Registra nuevo usuario | `{ email: string, password: string }` |
| `POST` | `/auth/login` | Inicia sesión | `{ email: string, password: string }` |

## Roadmap / Falta Implementar

1.  **Seguridad Real**:
    *   Reemplazar `FakePasswordHasher` por **Bcrypt**.
    *   Reemplazar `FakeTokenService` por **JWT** (`@nestjs/jwt`).

2.  **Persistencia Real**:
    *   Crear implementación Prisma de `AuthUserRepository` para guardar usuarios en PostgreSQL.

3.  **Roles y Permisos**:
    *   Añadir roles (Admin, User) al token.
