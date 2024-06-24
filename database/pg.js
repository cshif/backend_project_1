import pg from 'pg';

export const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'project_1',
  password: 'lol',
  port: 5432,
});
