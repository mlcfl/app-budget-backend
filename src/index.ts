import { getServerPort, onServerStarted } from "@shared/backend";
import { server } from "./server";

import "dotenv/config";

const port = getServerPort();
const instance = await server();

instance.listen(port, onServerStarted());
