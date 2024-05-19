import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

// import helmet from 'helmet';
import morgan from "morgan";

import { AppModule } from './app.module';
import { getCurrentInvoke } from '@vendia/serverless-express';

// https://stackoverflow.com/questions/68932747/adding-nestjs-as-express-module-results-in-nest-being-restarted
// https://stackoverflow.com/questions/54349998/use-nestjs-package-in-nodejs-express-project/67719723#67719723
export async function bootstrapApplication() {
	const nestApplication = await NestFactory.create<NestExpressApplication>(AppModule);
	nestApplication.setGlobalPrefix('api');
	nestApplication.enableCors();
	// nestApplication.use(helmet());
	nestApplication.useGlobalPipes(new ValidationPipe({
		whitelist: true, transform: true,
		transformOptions: { enableImplicitConversion: true }
	}));

	morgan.token('id', () => {
		return getCurrentInvoke().event?.requestContext?.requestId || Date.now().toString();
	});
	morgan.token('invocationId', () => {
		return getCurrentInvoke().context?.awsRequestId;
	});
	nestApplication.use(morgan('LOG => :id | :invocationId | :date[iso] | :method | :status | :url - :total-time ms'));
	return { nestApplication };
}