import { faker } from '@faker-js/faker';

export const createUser = () => ({
  email: faker.internet.email(),
  password: 'Test123!',
  name: faker.person.fullName()
});

export type RegisterUser = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
};

export function createRegisterUser(overrides?: Partial<RegisterUser>): RegisterUser {
  const password = faker.internet.password({ length: 12 }) + '!A1';

  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    phone: `09${faker.string.numeric(9)}`,
    password,
    confirmPassword: password,
    acceptTerms: true,
    acceptMarketing: false,
    ...overrides
  };
}
