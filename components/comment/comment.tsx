interface CommentProps {
  author: string;
  createdAt: Date;
  editedAt: Date | undefined;
  text: string;
}

export function Comment({ author, createdAt, text, editedAt }: CommentProps) {
  return (
    <div className="p-4 border bg-red-950 border-rose-200 flex flex-col justify-center rounded">
      <div>{author}</div>
      <div>{text}</div>
      <div>{createdAt.toTimeString()}</div>
      {editedAt ? <div className="text-gray-400">{editedAt.toTimeString()}</div> : null}
    </div>
  );
}
