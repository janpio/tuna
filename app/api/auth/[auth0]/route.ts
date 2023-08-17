import { handleAuth, handleCallback, AfterCallbackAppRoute, Session } from "@auth0/nextjs-auth0";
import { db } from "@/lib/prisma";

const afterCallback: AfterCallbackAppRoute = async (_, session, __) => {
  await createAndSyncNewUserModelToAuth0(session);

  return session;
};

export const GET = handleAuth({
  callback: handleCallback({ afterCallback }),
  onError(_: Request, error: Error) {
    console.error(error);
  },
});

async function createAndSyncNewUserModelToAuth0(session: Session) {
  const { nickname, email, sub } = session.user;

  const userData = { authProviderId: sub, email, handle: nickname, name: nickname };

  await db.user.upsert({ where: { authProviderId: sub }, create: { ...userData }, update: {} });
}
