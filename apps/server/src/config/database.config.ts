import { ConfigModule, registerAs } from '@nestjs/config';

export const registerAsDatabaseConfig = registerAs('database', () => ({
  uri: process.env.DATABASE_URL,
}));
