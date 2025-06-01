import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' }); // Muat variabel environment

export default {
  schema: './server/db/schema.ts', // Path ke file schema Anda
  out: './server/db/migrations',  // Direktori output untuk migrasi
  dialect: 'postgresql',          // Spesifikasikan dialek database
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Ambil URL database dari .env
  },
  // verbose: true, // Opsional: untuk logging lebih detail
  // strict: true,  // Opsional: untuk mode ketat
} satisfies Config;