import { getServerPort, onServerStarted } from "@shared/backend";
import { server } from "./server";

const port = getServerPort();
const instance = await server();

instance.listen(port, onServerStarted());
