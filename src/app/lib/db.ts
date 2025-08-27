import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const database = new Pool({
  connectionString,
});

database
  .connect()
  .then((client) => {
    console.log("Conexão com o banco Supabase OK!");
    client.release(); // libera o client de volta pro pool
  })
  .catch((err) => {
    console.error("Erro ao conectar com o banco:", err);
  });

export default database;
