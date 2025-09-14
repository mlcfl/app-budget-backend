import { randomUUID } from "node:crypto";
import {
	Router,
	Method,
	GET,
	type Request,
	type Response,
	Controller,
	TokenService,
	POST,
} from "@shared/backend";
import { UsersRepository } from "../repositories";
import type { Account } from "shared";
import currencies from "../currencies.json" assert { type: "json" };
import cryptoCurrencies from "../cryptoCurrencies.json" assert { type: "json" };

const accounts: Account[] = [];

@Router("/api")
export class ApiController extends Controller {
	@Method(GET, "/user")
	async getUser(req: Request, res: Response) {
		if (!req.xhr) {
			return res.sendStatus(400);
		}

		const { at: accessToken } = req.cookies;
		const { id } = await TokenService.verify(accessToken);

		if (!id) {
			return res.sendStatus(401);
		}

		const {
			rows: [user],
		} = await UsersRepository.getUserByLogin(id);

		return res.send(user);
	}

	@Method(GET, "/accounts")
	async getAccounts(req: Request, res: Response) {
		if (!req.xhr) {
			res.sendStatus(400);
			return;
		}

		const { at: accessToken } = req.cookies;
		const { id } = await TokenService.verify(accessToken);

		if (!id) {
			res.sendStatus(401);
			return;
		}

		return res.send(accounts);
	}

	@Method(GET, "/currencies")
	async getCurrencies(req: Request, res: Response) {
		// https://gist.github.com/ksafranski/2973986
		const list = Object.entries(currencies).map(([key]) => key);

		return res.send({
			regular: list,
			crypto: cryptoCurrencies,
		});
	}

	@Method(GET, "/account-types")
	async getAccountTypes(req: Request, res: Response) {
		const types = ["cash", "card", "crypto", "other"];

		return res.send(types);
	}

	@Method(POST, "/accounts")
	async addAccount(req: Request, res: Response) {
		const newAccount: Account = {
			id: randomUUID(),
			name: req.body.name,
			type: req.body.type,
			currency: req.body.currency,
			balance: req.body.initialBalance,
			initialBalance: req.body.initialBalance,
			status: "active",
			createdDate: new Date().toISOString(),
			closedDate: "",
			lastTransactionDate: "",
			note: req.body.note,
		};

		accounts.push(newAccount);

		return res.status(201).send(newAccount);
	}
}
