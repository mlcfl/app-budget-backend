import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { tmpdir, platform } from "node:os";
import { execa } from "execa";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient as PostgresClient } from "../generated/postgres/client";
import { PrismaClient as SqliteClient } from "../generated/sqlite/client";
import type { AppConfig } from "../types";

let Postgres: PostgresClient;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const initPostgres = async (appConfig?: AppConfig) => {
	const mode = appConfig?.dbMode ?? process.env.DATABASE_MODE;
	const url = appConfig?.postgresUrl ?? process.env.PG_DATABASE_URL;

	let client;

	if (mode === "memory") {
		console.log("Starting in-memory Postgres instance...");

		// For Unix-like systems, use memory
		// For Windows, use a temporary file
		const datasourceUrl =
			platform() !== "win32"
				? "file::memory:?cache=shared"
				: `file:${join(tmpdir(), `memory-${Date.now()}.db`)}`;

		client = new SqliteClient({ datasourceUrl });

		// Push the Prisma schema to the in-memory database
		await execa("pnpm prisma:deploy:sqlite", {
			stdio: "inherit",
			env: {
				...process.env,
				PG_DATABASE_URL: datasourceUrl,
			},
			cwd: join(__dirname, ".."),
		});

		console.log("In-memory Postgres instance started.");
	} else {
		const adapter = new PrismaPg({ connectionString: url });
		client = new PostgresClient({ adapter });
	}

	Postgres = client as unknown as PostgresClient;
};

export { Postgres };
