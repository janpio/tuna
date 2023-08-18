import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";
import { PrismaClient, User, Post } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  await deleteAllData();
  const users = await createUsers();
  const posts = await createPosts(users);
}

async function deleteAllPosts() {
  await db.post.deleteMany();
}

async function deleteAllUsers() {
  await db.user.deleteMany();
}

async function deleteAllData() {
  await deleteAllPosts();
  await deleteAllUsers();
}

async function createUsers() {
  const users: User[] = [];

  for (let i = 0; i < 100; i++) {
    const newUser = await db.user.create({
      data: {
        authProviderId: nanoid(),
        handle: faker.internet.displayName(),
        name: faker.internet.displayName(),
      },
    });
    users.push(newUser);
  }

  return users;
}

export async function createPosts(users: User[]) {
  const posts: Post[] = [];

  users.forEach(async (user) => {
    const postCount = faker.number.int({ min: 0, max: 50 });

    const newPosts = await db.post.createMany({
      data: Array.from({ length: postCount }, () => ({
        authorId: user.id,
        text: faker.word.words({ count: { min: 3, max: 15 } }),
      })),
    });
    /* FIXME for now prisma does not support returning the actual records when
    using `*Many` methods. A work around for this, should i need to supply 
    existing posts to a subsequent query is to either do a findMany here, or
    do findMany's in all the seed create functions, instead of passing return of
    other functions as an argument.

    prisma github issue to follow:
    https://github.com/prisma/prisma/issues/8131
    */
    return newPosts;
  });

  return posts;
}

/* FIXME this only runs when package.json has `"type": "module"`. But when this
is added, the actual Next app breaks. */
main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
