import { Repository } from "@shared/backend";
import { Postgres } from "../lib";
import type { Prisma } from "../generated/postgres/client";

type User = Prisma.UsersGetPayload<{
	select: {
		uid: true;
		login: true;
	};
}>;

export class UsersRepository extends Repository {
	static async getUserByLogin(login: string): Promise<User | null> {
		return Postgres.users.findFirst({
			where: { login },
			select: {
				uid: true,
				login: true,
			},
		});
	}
}
