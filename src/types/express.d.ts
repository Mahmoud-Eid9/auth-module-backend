import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { sub: string; name: string }; // Optional user object
  }
}
