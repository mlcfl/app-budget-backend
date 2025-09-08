import { Repository } from "@shared/backend";

type User = {
	uid: string;
	login: string;
};

export class UsersRepository extends Repository {
	static async getUserByLogin(login: string): Promise<{ rows: User[] }> {
		return this.postgres.query(
			'SELECT "uid", "login" FROM users WHERE login = $1 LIMIT 1',
			[login]
		);
	}
}
