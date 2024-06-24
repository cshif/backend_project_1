import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'project_1',
  password: 'lol',
  port: 5432,
});

export const query = (text, params, callback) =>
  pool.query(text, params, callback);
