import { randomUUID } from "node:crypto";
import {
	Router,
	Method,
	GET,
	type Request,
	type Response,
	Controller,
	POST,
	RequireXHR,
	RequireAuth,
	PATCH,
	DELETE,
	PUT,
} from "@shared/backend";
import { UsersRepository } from "../repositories";
import type { Account, Category } from "shared";
import currencies from "../currencies.json" assert { type: "json" };
import cryptoCurrencies from "../cryptoCurrencies.json" assert { type: "json" };

const accounts: Account[] = [];
const categories: { incomes: Category[]; expenses: Category[] } = {
	incomes: [],
	expenses: [],
};

@Router("/api")
@RequireXHR()
@RequireAuth()
export class ApiController extends Controller {
	@Method(GET, "/user")
	async getUser(req: Request, res: Response) {
		const {
			rows: [user],
		} = await UsersRepository.getUserByLogin(req.userId);

		return res.send(user);
	}

	@Method(GET, "/accounts")
	async getAccounts(req: Request, res: Response) {
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

	@Method(PATCH, "/accounts")
	async editAccount(req: Request, res: Response) {
		const account: Account = req.body;
		const index = accounts.findIndex(({ id }) => id === account.id);

		accounts.splice(index, 1, account);

		return res.sendStatus(200);
	}

	@Method(DELETE, "/accounts/:id")
	async removeAccount(req: Request, res: Response) {
		const accountId: string = req.params.id;
		const index = accounts.findIndex(({ id }) => id === accountId);

		accounts.splice(index, 1);

		return res.sendStatus(200);
	}

	@Method(GET, "/categories")
	async getCategories(req: Request, res: Response) {
		return res.send(categories);
	}

	@Method(POST, "/categories")
	async addCategory(req: Request, res: Response) {
		const newCategory: Category = {
			id: randomUUID(),
			title: req.body.title,
		};

		categories[req.body.type as "incomes" | "expenses"].push(newCategory);

		return res.status(201).send(newCategory);
	}

	@Method(DELETE, "/categories/:type/:id")
	async removeCategory(req: Request, res: Response) {
		const type = req.params.type as "incomes" | "expenses";
		const categoryId = req.params.id;
		const index = categories[type].findIndex(({ id }) => id === categoryId);

		categories[type].splice(index, 1);

		return res.sendStatus(200);
	}

	@Method(PUT, "/categories/:type")
	async replaceCategories(req: Request, res: Response) {
		const type = req.params.type as "incomes" | "expenses";
		const list = req.body.list;

		categories[type] = list;

		return res.sendStatus(200);
	}
}
