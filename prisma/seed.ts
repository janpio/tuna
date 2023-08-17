import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const user = await db.user.create({
    data: {
      authProviderId: nanoid(),
      handle: faker.internet.displayName(),
      name: faker.internet.displayName(),
    },
  });
  console.log({ user });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
