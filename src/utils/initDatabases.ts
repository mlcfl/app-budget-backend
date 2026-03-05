import { Postgres, initPostgres } from "../lib";
import type { AppConfig } from "../types";

export const initDatabases = async (appConfig?: AppConfig) => {
	await initPostgres(appConfig);

	process.on("SIGINT", async () => {
		await Postgres.$disconnect();
		process.exit(0);
	});
};
