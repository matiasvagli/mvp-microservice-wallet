import { UserPassword } from "./user-password.vo";

describe('UserPassword Value Object', () => {
  describe('create method', () => {
    it('should create a UserPassword with a valid plain password', () => {
      const plainPassword = 'validPass123';
      const userPassword = UserPassword.create(plainPassword);
      expect(userPassword).toBeInstanceOf(UserPassword);
      expect(userPassword.getValue).toBe(plainPassword);
    });

    it('should throw an error for a password that is too short', () => {
      const shortPassword = 'short';
      expect(() => {
        UserPassword.create(shortPassword);
      }).toThrow('Password too short');
    });
  });

  describe('fromValue method', () => {
    it('should create a UserPassword from a hashed password', () => {
      const hashedPassword = 'hashedPass123';
      const userPassword = UserPassword.fromValue(hashedPassword);
      expect(userPassword).toBeInstanceOf(UserPassword);
      expect(userPassword.getValue).toBe(hashedPassword);
    });
  });
});