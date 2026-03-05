import { randomUUID } from "node:crypto";
import {
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	Put,
	Req,
	Res,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { UsersRepository } from "../repositories";
import type { Account, Category } from "shared";
import currencies from "../currencies.json" assert { type: "json" };
import cryptoCurrencies from "../cryptoCurrencies.json" assert { type: "json" };

const accounts: Account[] = [];
const categories: { incomes: Category[]; expenses: Category[] } = {
	incomes: [],
	expenses: [],
};

@Controller("api")
export class ApiController {
	@Get("user")
	async getUser(@Req() req: Request, @Res() res: Response) {
		const user = await UsersRepository.getUserByLogin((req as any).userId);

		return res.send(user);
	}

	@Get("accounts")
	async getAccounts(@Req() _req: Request, @Res() res: Response) {
		return res.send(accounts);
	}

	@Get("currencies")
	async getCurrencies(@Req() _req: Request, @Res() res: Response) {
		// https://gist.github.com/ksafranski/2973986
		const list = Object.entries(currencies).map(([key]) => key);

		return res.send({
			regular: list,
			crypto: cryptoCurrencies,
		});
	}

	@Get("account-types")
	async getAccountTypes(@Req() _req: Request, @Res() res: Response) {
		const types = ["cash", "card", "crypto", "other"];

		return res.send(types);
	}

	@Post("accounts")
	async addAccount(@Req() req: Request, @Res() res: Response) {
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

	@Patch("accounts")
	async editAccount(@Req() req: Request, @Res() res: Response) {
		const account: Account = req.body;
		const index = accounts.findIndex(({ id }) => id === account.id);

		accounts.splice(index, 1, account);

		return res.sendStatus(200);
	}

	@Delete("accounts/:id")
	async removeAccount(@Req() req: Request, @Res() res: Response) {
		const accountId: string = req.params.id;
		const index = accounts.findIndex(({ id }) => id === accountId);

		accounts.splice(index, 1);

		return res.sendStatus(200);
	}

	@Get("categories")
	async getCategories(@Req() _req: Request, @Res() res: Response) {
		return res.send(categories);
	}

	@Post("categories")
	async addCategory(@Req() req: Request, @Res() res: Response) {
		const newCategory: Category = {
			id: randomUUID(),
			title: req.body.title,
		};

		categories[req.body.type as "incomes" | "expenses"].push(newCategory);

		return res.status(201).send(newCategory);
	}

	@Delete("categories/:type/:id")
	async removeCategory(@Req() req: Request, @Res() res: Response) {
		const type = req.params.type as "incomes" | "expenses";
		const categoryId = req.params.id;
		const index = categories[type].findIndex(({ id }) => id === categoryId);

		categories[type].splice(index, 1);

		return res.sendStatus(200);
	}

	@Put("categories/:type")
	async replaceCategories(@Req() req: Request, @Res() res: Response) {
		const type = req.params.type as "incomes" | "expenses";
		const list = req.body.list;

		categories[type] = list;

		return res.sendStatus(200);
	}
}
