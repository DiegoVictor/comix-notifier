import factory from 'factory-girl';
import { faker } from '@faker-js/faker';

factory.define('Config', {}, () => {
  const fieldName = faker.lorem.word();
  return {
    id: faker.string.uuid,
    name: faker.lorem.word,
    value: {
      [fieldName]: faker.number.int,
    },
  };
});

factory.define('Product', {}, () => {
  const title = faker.commerce.productName();
  return {
    title,
    number: faker.number.int,
    slug: faker.helpers.slugify(title),
  };
});

export default factory;
