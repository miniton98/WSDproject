import { config } from '../deps.js';

const env = config();
let DB_config = {};

  DB_config.database = {
    hostname: env.PGHOST,
    database: env.PGDATABASE,
    user: env.PGDATABASE,
    password: env.PGPASSWORD,
    port: 5432
  };
/*
//for testing
DB_config.database = {
  hostname: "test database host",
  database: "test database",
  user: "test database",
  password: "test database password",
  port: 5432
};*/

export { DB_config }; 