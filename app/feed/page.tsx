import { db } from "@/prisma";

async function getFoobars() {
  const foobars = await db.foobar.findMany();

  if (!(foobars.length > 0)) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return foobars;
}

export default async function Feed() {
  const foobars = await getFoobars();

  return (
    <div>
      {foobars.map((foobar) => (
        <div key={foobar.id}>
          <div>{foobar.fizz}</div>
          <div>{foobar.buzz}</div>
        </div>
      ))}
    </div>
  );
}
