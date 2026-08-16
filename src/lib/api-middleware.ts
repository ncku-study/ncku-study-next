import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { Session } from 'next-auth';

type AuthenticatedSession = Session;

type AdminRouteHandler<TContext> = (
  request: Request,
  context: TContext,
  session: AuthenticatedSession,
) => Response | Promise<Response>;

/**
 * Shared authentication middleware for every admin API route.
 * Resource handlers only receive authenticated requests and contain no auth branching.
 */
export function withAdminAuth<TContext>(
  handler: AdminRouteHandler<TContext>,
): (request: Request, context: TContext) => Promise<Response> {
  return async (request, context) => {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(request, context, session as AuthenticatedSession);
  };
}
