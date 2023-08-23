import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const USER_COUNT = 20;
const MAX_POSTS_PER_USER_COUNT = 30;
const MAX_COMMENTS_PER_POST = 30;

const db = new PrismaClient();

async function main() {
  await deleteAllData();
  await createUsers();
  await createPosts();
  await createComments();
}

async function deleteAllData() {
  await deleteAllComments();
  await deleteAllPosts();
  await deleteAllUsers();
}

async function deleteAllComments() {
  await db.comment.deleteMany();
}

async function deleteAllPosts() {
  await db.post.deleteMany();
}

async function deleteAllUsers() {
  await db.user.deleteMany();
}

async function createUsers() {
  const usersData = Array.from({ length: USER_COUNT }, () => ({
    authProviderId: nanoid(),
    handle: faker.internet.displayName(),
    name: faker.internet.displayName(),
  }));

  await db.user.createMany({ data: usersData });
}

/* FIXME for now prisma does not support returning the actual records when
using `*Many` methods. A work around for this, should i need to supply 
existing posts to a subsequent query is to either do a findMany here, or
do findMany's in all the seed create functions, instead of passing return of
other functions as an argument.

prisma github issue to follow:
https://github.com/prisma/prisma/issues/8131
*/
// TODO see if frontend renders properly or that weird large table issue that should only affect mariaDB years ago hahppens. pretty sure my original bug was just bad quickly written code
// TODO try change to map for concurrent awaits, then if it is fine, up the number of MAX everything see if it breaks actual frontend
async function createPosts() {
  const users = await db.user.findMany();

  for (const user of users) {
    const postCount = faker.number.int({ min: 0, max: MAX_POSTS_PER_USER_COUNT });
    const postsData = Array.from({ length: postCount }, () => ({
      authorId: user.id,
      text: faker.word.words({ count: { min: 3, max: 15 } }),
    }));

    await db.post.createMany({
      data: postsData,
    });
  }
}

async function createComments() {
  const posts = await db.post.findMany();

  for (const post of posts) {
    const commentCount = faker.number.int({ min: 0, max: MAX_COMMENTS_PER_POST });
    const commentData = Array.from({ length: commentCount }, () => ({
      postId: post.id,
      authorId: post.authorId,
      text: faker.word.words({ count: { min: 3, max: 15 } }),
    }));

    await db.comment.createMany({
      data: commentData,
    });
  }
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
