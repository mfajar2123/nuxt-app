import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' }); 

export default {
  schema: './server/db/schema.ts', 
  out: './server/db/migrations', 
  dialect: 'postgresql',          
  dbCredentials: {
    url: process.env.DATABASE_URL!, 
  },
  // verbose: true, // Opsional: untuk logging lebih detail
  // strict: true,  // Opsional: untuk mode ketat
} satisfies Config;