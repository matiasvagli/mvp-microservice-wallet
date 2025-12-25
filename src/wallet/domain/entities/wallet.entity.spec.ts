import { Wallet } from './wallet.entity';
import { UUID } from '../../../shared/domain/value-objects/uuid.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { Currency } from '../value-objects/currency';

jest.mock('uuid', () => ({
  v4: () => '123e4567-e89b-12d3-a456-426614174000',
  validate: () => true
}));

describe('Wallet Entity', () => {
  const ownerId = UUID.random();
  const wallet = Wallet.createStandard(ownerId, Currency.fromCode('USD'));
  const depositAmount = new Money(100, Currency.fromCode('USD'));


 describe('Wallet Entity', () => {
  let ownerId: UUID;
  let wallet: Wallet;
  const USD = Currency.fromCode('USD');

  beforeEach(() => {
    ownerId = UUID.random();
    // Inicializamos una wallet nueva en cada test para evitar efectos secundarios
    wallet = Wallet.createStandard(ownerId, USD);
  });

  it('should deposit money correctly', () => {
    const depositAmount = new Money(100, USD);
    
    wallet.deposit(depositAmount);
    
    // Aquí estaba el error: balanceAmount YA es el número
    expect(wallet.balanceAmount).toBe(100);
  });

  it('should throw error when creating a Teen wallet without a parent', () => {
    expect(() => {
      // Usamos el factory de Teen pero sin pasarle el padre (si el tipado lo permite)
      // O probamos el constructor privado/hydrate si fuera necesario
      Wallet.createTeen(ownerId, null as any, USD);
    }).toThrow('Teen wallets must be linked to a parent wallet');
  });

  it('should prevent transfer to a non-whitelisted wallet if teen', () => {
    const parentId = UUID.random();
    const teenWallet = Wallet.createTeen(ownerId, parentId, USD);
    teenWallet.deposit(new Money(100, USD));
    
    const strangerWalletId = UUID.random();
    const transferAmount = new Money(50, USD);

    expect(() => {
      teenWallet.transfer(transferAmount, strangerWalletId);
    }).toThrow('Target wallet is not in the whitelist');
  });
});
});