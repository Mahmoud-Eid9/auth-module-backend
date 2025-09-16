import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  //enable cors from frontend development server
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true, 
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
