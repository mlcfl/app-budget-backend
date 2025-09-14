import { resolve } from "node:path";
import express, {
	type Request,
	type Response,
	type NextFunction,
} from "express";
import cookieParser from "cookie-parser";
import {
	getAppName,
	getPresetType,
	initSSG,
	initSSR,
	initDatabases,
} from "./utils";
import { initRouter, TokenService, sharedControllers } from "@shared/backend";
import { ApiController } from "./controllers";

const errorHandler = (
	error: unknown,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (res.headersSent) {
		return;
	}

	console.error(error);
	res.status(500).send("Internal server error");
};

export const server = async () => {
	const appName = getAppName();
	const frontendRoot = resolve(
		import.meta.dirname,
		`../../${appName}-frontend`
	);
	const { isCSRorSSG, isSSR } = await getPresetType(frontendRoot);

	await initDatabases();

	const app = express();

	app.use(cookieParser());
	app.use(express.json());

	// API
	initRouter(app, [...sharedControllers, ApiController]);

	// GET pages
	app.use(async (req, res, next) => {
		// Do not check token for !GET requests
		if (req.method !== "GET") {
			return next();
		}

		// Do not check token for assets
		const assets =
			/\.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot|map|webp|json)$/;
		const assetsPath = /^\/(?:_nuxt|assets|static|api)/;
		const { protocol, originalUrl: url } = req;

		if (assetsPath.test(url) || assets.test(url)) {
			return next();
		}

		const { at: accessToken } = req.cookies;

		const host = req.get("host");
		const fullUrl = encodeURIComponent(`${protocol}://${host}${url}`);
		const uri = `http://auth.mlc.local:3000/api/refresh-token?to=${fullUrl}`;

		// Check auth service
		try {
			const { status } = await fetch("http://auth.mlc.local:3000/api/ping");

			if (status !== 200) {
				res.sendStatus(403);
				return;
			}
		} catch (e) {
			res.sendStatus(403);
			return;
		}

		// No accessToken cookie
		if (!accessToken) {
			return res.redirect(uri);
		}

		const { id } = await TokenService.verify(accessToken);

		// Invalid accessToken
		if (!id) {
			return res.redirect(uri);
		}

		next();
	});

	if (isCSRorSSG) {
		initSSG(app, frontendRoot);
	} else if (isSSR) {
		await initSSR(app, frontendRoot);
	}

	app.use(errorHandler);

	return app;
};
