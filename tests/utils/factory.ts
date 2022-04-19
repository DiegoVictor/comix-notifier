import factory from "factory-girl";
import faker from "@faker-js/faker";

factory.define("Config", {}, () => {
  const fieldName = faker.lorem.word();
  return {
    id: faker.datatype.uuid,
    name: faker.lorem.word,
    value: {
      [fieldName]: faker.datatype.number,
    },
  };
});

factory.define("Product", {}, () => {
  const title = faker.commerce.productName();
  return {
    title,
    number: faker.datatype.number,
    slug: faker.helpers.slugify(title),
  };
});

export default factory;
