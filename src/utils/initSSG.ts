import { join } from "node:path";
import express, { type Express, type Request, type Response } from "express";

const notFound =
	(publicPath: string) =>
	(req: Request, res: Response): void => {
		if (res.headersSent) {
			return;
		}

		res.status(404).sendFile("404.html", { root: publicPath });
	};

export const initSSG = (app: Express, pathToFrontendRoot: string) => {
	const publicPath = join(pathToFrontendRoot, ".output/public");

	app.use(express.static(publicPath));
	app.use(notFound(publicPath));
};
