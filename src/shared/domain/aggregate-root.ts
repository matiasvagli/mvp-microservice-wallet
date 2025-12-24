// src/shared/domain/aggregate-root.ts

export abstract class AggregateRoot {
  // Lista interna de cosas que pasaron en esta entidad
  private _domainEvents: any[] = [];

  get domainEvents(): any[] {
    return [...this._domainEvents];
  }

  // Las entidades hijas usarán esto para registrar que algo pasó
  protected addDomainEvent(event: any): void {
    this._domainEvents.push(event);
    // Log de debugging para el junior que llevamos dentro
    console.log(`[Domain Event Registered]: ${event.constructor.name}`);
  }

  clearEvents(): void {
    this._domainEvents = [];
  }
}