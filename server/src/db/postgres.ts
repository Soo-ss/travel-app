type PgQueryResult<T> = { rows: T[] };

type PgPool = {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<PgQueryResult<T>>;
};

type PgModule = {
  Pool: new (config: Record<string, unknown>) => PgPool;
};

let poolInstance: PgPool | null = null;

async function loadPgModule(): Promise<PgModule> {
  // Dynamic import keeps compile-time flexible before installing pg.
  const modulePath = "pg";
  return (await import(modulePath)) as unknown as PgModule;
}

async function createPool(): Promise<PgPool> {
  const pg = await loadPgModule();

  return new pg.Pool({
    host: process.env.PG_HOST || "127.0.0.1",
    port: Number(process.env.PG_PORT || "5432"),
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASSWORD || "",
    database: process.env.PG_DATABASE || "travel_app",
    max: Number(process.env.PG_POOL_MAX || "10"),
    idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS || "30000"),
  });
}

export async function getPostgresPool(): Promise<PgPool> {
  if (poolInstance) return poolInstance;
  poolInstance = await createPool();
  return poolInstance;
}

export async function executeQuery<T = unknown[]>(
  sql: string,
  params: unknown[] = [],
): Promise<T> {
  const pool = await getPostgresPool();
  const result = await pool.query<T extends (infer U)[] ? U : never>(sql, params);
  return result.rows as T;
}
