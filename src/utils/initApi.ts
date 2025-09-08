import type { Express } from "express";

export const initApi = (app: Express) => {
	app.get("/api/check-cookie", (req, res) => {
		const { cookies } = req;
		console.log("Check cookie", cookies);

		res.send(cookies);
	});
};
