import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5000',
    credentials: true, 
  });
    app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
