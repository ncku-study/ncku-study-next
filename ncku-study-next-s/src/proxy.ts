import { auth } from './auth';

export default auth(function proxy(request) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  if (isAdminRoute && !isLoginPage && !request.auth) {
    const loginUrl = new URL('/admin/login', request.url);
    return Response.redirect(loginUrl);
  }
}) as unknown as ReturnType<typeof auth>;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
