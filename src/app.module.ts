import { Module } from "@nestjs/common";
import { ApiController } from "./controllers";

@Module({
	controllers: [ApiController],
})
export class AppModule {}
