import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'bn', 'mr'],
  defaultLocale: 'en',
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

console.log('Middleware is running for this request');
