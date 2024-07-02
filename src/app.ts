import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import helmet from 'helmet';
import { Bot, webhookCallback } from 'grammy';
import morgan from "morgan";

import { AppModule } from './app.module';
import { getCurrentInvoke } from '@vendia/serverless-express';

export async function bootstrapApplication() {
	const bot = new Bot(process.env.TELEGRAM_SECERET_KEY);
	const application = await NestFactory.create<NestExpressApplication>(AppModule);
	application.setGlobalPrefix('api');
	application.enableCors();
	application.use(helmet());
	application.useGlobalPipes(new ValidationPipe({
		whitelist: true, transform: true,
		transformOptions: { enableImplicitConversion: true }
	}));
	application.use(webhookCallback(bot, 'aws-lambda-async'));

	morgan.token('id', () => {
		return getCurrentInvoke().event?.requestContext?.requestId || Date.now().toString();
	});
	morgan.token('invocationId', () => getCurrentInvoke().context?.awsRequestId);
	application.use(morgan('LOG => :id | :invocationId | :date[iso] | :method | :status | :url - :total-time ms'));
	return application;
}