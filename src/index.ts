import { server } from "./server";

import "dotenv/config";

const port = process.env.PORT;
const instance = await server();

instance.listen(port, () => {
	console.log(`Server is started on port ${port}`);
});
