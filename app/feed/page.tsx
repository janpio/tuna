import { db } from "@/lib/prisma";
import { Post } from "@/components";

async function getPosts() {
  const posts = await db.post.findMany({ take: 10, orderBy: { createdAt: "desc" }, include: { author: true } });

  if (!(posts.length > 0)) {
    throw new Error("Failed to fetch data");
  }

  return posts;
}

export default async function Feed() {
  const posts = await getPosts();

  return (
    <div className="flex flex-col space-y-4">
      {posts.map((post) => (
        <Post
          author={post.author.name}
          createdAt={post.createdAt}
          text={post.text}
          editedAt={post.edited ? post.updatedAt : undefined}
          key={post.id}
        />
      ))}
    </div>
  );
}
