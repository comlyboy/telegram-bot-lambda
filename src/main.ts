import { Logger } from "@nestjs/common";

import { bootstrapApplication } from "./app";

async function bootstrap(): Promise<void> {
	const PORT = 3300;
	const { nestApplication } = await bootstrapApplication();
	await nestApplication.listen(PORT);
	Logger.debug(`Server running on ${await nestApplication.getUrl()}/api`);
	Logger.verbose(`Confirm server health on ${await nestApplication.getUrl()}/api/health`);
}
bootstrap();