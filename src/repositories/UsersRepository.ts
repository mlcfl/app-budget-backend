import { Postgres } from "../lib";
import type { Prisma } from "../generated/postgres/client";

type User = Prisma.UsersGetPayload<{
	select: {
		uid: true;
		login: true;
	};
}>;

export class UsersRepository {
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
