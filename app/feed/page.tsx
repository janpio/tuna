import { db } from "@/lib/prisma";

async function getPosts() {
  const posts = await db.post.findMany();

  if (!(posts.length > 0)) {
    throw new Error("Failed to fetch data");
  }

  return posts;
}

export default async function Feed() {
  const posts = await getPosts();

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <div>{post.text}</div>
        </div>
      ))}
    </div>
  );
}
