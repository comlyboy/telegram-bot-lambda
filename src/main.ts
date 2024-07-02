import { Logger } from "@nestjs/common";

import { bootstrapApplication } from "./app";

async function bootstrap(): Promise<void> {
	const PORT = 3300;
	const application = await bootstrapApplication();
	await application.listen(PORT);
	Logger.debug(`Server running on ${await application.getUrl()}/api`);
	Logger.verbose(`Confirm server health on ${await application.getUrl()}/api/health`);
}
bootstrap();