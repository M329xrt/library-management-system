import "dotenv/config";
import pg from "pg";

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 20000
});

try {
  await client.connect();
  const result = await client.query(
    "SELECT migration_name, finished_at, rolled_back_at FROM _prisma_migrations ORDER BY started_at"
  );
  console.table(result.rows);
} catch (error) {
  console.log("ERROR:", error.message);
} finally {
  await client.end().catch(() => {});
}
