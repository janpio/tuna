import { ComponentProps } from "react";
import { Comment } from "@/components/comment";

interface PostProps {
  author: string;
  createdAt: Date;
  editedAt: Date | null;
  text: string;
  comments: ComponentProps<typeof Comment>[];
}

export function Post({ author, createdAt, text, editedAt, comments }: PostProps) {
  return (
    <div className="p-4 border border-red-200 flex flex-col justify-center rounded">
      <div>{author}</div>
      <div>{text}</div>
      <div>{createdAt.toTimeString()}</div>
      {editedAt ? <div className="text-gray-400">{editedAt.toTimeString()}</div> : null}
      {comments.map((comment) => (
        <Comment
          author={comment.author}
          createdAt={comment.createdAt}
          text={comment.text}
          editedAt={comment.editedAt}
        />
      ))}
    </div>
  );
}
