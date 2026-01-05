export class MoneyWithdrawnEvent {
    constructor(
        public readonly walletId: string,
        public readonly amount: number,
        public readonly occurredAt: Date = new Date(),
    ) { }
}