import { Pool, Client} from "../deps.js";
import { DB_config } from "../config/config.js";


const getClient = () => {
  return new Client(DB_config.database);
}

const executeQuery = async(query, ...args) => {
  const client = getClient();
  try {
    await client.connect();
    return await client.query(query, ...args);
  } catch (e) {
    console.log(e);
  } finally {
    await client.end();
  }
}

/*
const CONCURRENT_CONNECTIONS = 5;

const getPool = () => {
  
  return new Pool(DB_config.database, CONCURRENT_CONNECTIONS);
}

const executeQuery = async(query, ...params) => {
  const pool = await getPool().connect();
  try {
      return await pool.query(query, ...params);
  } catch (e) {
      console.log(e);  
  } finally {
      pool.release();
  }
  
  return null;
};*/

export { executeQuery };