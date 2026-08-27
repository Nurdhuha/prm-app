import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL || 'postgresql://prmunesa_user:prmunesa_password@127.0.0.1:5432/prmunesa?schema=public';

const globalForDb = global as unknown as { pool: Pool };

export const db =
  globalForDb.pool ||
  new Pool({
    connectionString,
    max: 30,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

if (process.env.NODE_ENV !== 'production') globalForDb.pool = db;
