import { db } from "@/lib/prisma";
import { Post } from "@/components";

async function getPosts() {
  const comments = await db.comment.findMany({ take: 10 });
  console.log("🚀 ~ file: page.tsx:6 ~ getPosts ~ comments:", comments);
  const posts = await db.post.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      comments: { take: 10 },
      // comments: {
      //   select: {
      //     author: true,
      //     authorId: true,
      //     createdAt: true,
      //     edited: true,
      //     id: true,
      //     post: true,
      //     postId: true,
      //     text: true,
      //     updatedAt: true,
      //   },
      // },
      // comments: {
      //   include: {
      //     author: true,
      //   },
      // },
    },
  });

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
          editedAt={post.edited ? post.updatedAt : null}
          key={post.id}
          comments={post.comments.map((comment) => ({
            ...comment,
            author: "DERP MAN",
            editedAt: comment.edited ? comment.updatedAt : null,
          }))}
        />
      ))}
    </div>
  );
}
