import { faker } from '@faker-js/faker';

export const createUser = () => ({
  email: faker.internet.email(),
  password: 'Test123!',
  name: faker.person.fullName()
});
