import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    csrfToken(): string;          // CSRF token method
    user?: { sub: string; name: string }; // Optional user object
  }
}