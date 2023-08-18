interface PostProps {
  author: string;
  createdAt: Date;
  editedAt?: Date;
  text: string;
}
export function Post({ author, createdAt, text, editedAt }: PostProps) {
  return (
    <div className="p-4 border border-red-200 flex flex-col justify-center rounded">
      <div>{author}</div>
      <div>{text}</div>
      <div>{createdAt.toTimeString()}</div>
      {editedAt ? <div className="text-gray-400">{editedAt.toTimeString()}</div> : null}
    </div>
  );
}
