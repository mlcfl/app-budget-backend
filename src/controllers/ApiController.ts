import {
	Router,
	Method,
	GET,
	type Request,
	type Response,
	Controller,
	TokenService,
} from "@shared/backend";
import { UsersRepository } from "../repositories";

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
}
