import { Memory, MemoryKeys, Postgres, Mongo } from "@shared/backend";

export const initDatabases = async () => {
	const env = process.env as any;

	const postgres = new Postgres({
		user: env.PGUSER,
		password: env.PGPASSWORD,
		host: env.PGHOST,
		database: env.PGDATABASE,
		port: env.PGPORT,
	});

	const mongo = new Mongo(env.MONGO_CONNECTION_STRING);
	await mongo.connect();

	Memory.set(MemoryKeys.Postgres, postgres);
	Memory.set(MemoryKeys.Mongo, mongo);

	process.on("SIGINT", async () => {
		await postgres.pool.end();
		await mongo.disconnect();
		process.exit(0);
	});
};
