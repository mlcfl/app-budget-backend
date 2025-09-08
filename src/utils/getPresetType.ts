import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

export const getPresetType = async (pathToFrontendRoot: string) => {
	const path = join(pathToFrontendRoot, ".output/nitro.json");

	if (!existsSync(path)) {
		throw new Error(
			`The ".output/nitro.json" file was not found in the frontend directory. Please, build the frontend part of the application before starting the server.`
		);
	}

	const file = await readFile(path, "utf8");
	const { preset } = JSON.parse(file);

	return {
		preset,
		isSSR: preset === "node-listener",
		isCSRorSSG: preset === "static",
	};
};
