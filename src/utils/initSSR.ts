import { join } from "node:path";
import { pathToFileURL } from "node:url";
import express, { type Express } from "express";

export const initSSR = async (app: Express, pathToFrontendRoot: string) => {
	const serverEntry = join(pathToFrontendRoot, ".output/server/index.mjs");
	const { href } = pathToFileURL(serverEntry);
	const { handler } = await import(href);

	// Frontend assets
	const publicPath = join(pathToFrontendRoot, ".output/public");
	app.use(express.static(publicPath));

	app.use(handler);
};
