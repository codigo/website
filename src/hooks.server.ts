import type { Handle } from '@sveltejs/kit';
import { logger, uuidv4 } from '$lib/stores/loggerStore';
import { subscribeToPostEmbeddings } from '$lib/services/postEmbeddingSubscription';

// Start automatic embedding generation for new/updated posts
subscribeToPostEmbeddings();

function logRequest(
	event: Parameters<Handle>[0]['event'],
	duration?: number,
	status?: number,
	error?: Error
) {
	const headers = event.request.headers;
	const logData = {
		requestId: event.locals.requestId,
		method: event.request.method,
		url: event.url.pathname,
		clientIp: headers.get('CF-Connecting-IP') || headers.get('X-Forwarded-For'),
		protocol: headers.get('X-Forwarded-Proto'),
		cfRay: headers.get('CF-Ray'),
		userAgent: headers.get('User-Agent')
	};

	// Filter out null or undefined fields
	const filteredLogData = Object.fromEntries(
		Object.entries(logData).filter(([, value]) => value != null)
	);

	if (error) {
		logger.error(
			{ ...filteredLogData, error: error.message, stack: error.stack },
			'Request failed'
		);
	} else if (duration !== undefined && status !== undefined) {
		logger.info({ ...filteredLogData, duration, status }, 'Request completed');
	} else {
		logger.info(filteredLogData, 'Incoming request');
	}
}

export const handle: Handle = async function ({ event, resolve }) {
	const start_time = Date.now();
	try {
		event.locals.requestId = event.request.headers.get('CF-Ray') || uuidv4();
		const requestLogger = logger.child({ requestId: event.locals.requestId });
		event.locals.logger = requestLogger;

		logRequest(event);
		// Wait on response, run other hooks and load
		const response = await resolve(event);
		const duration = Date.now() - start_time;
		logRequest(event, duration, response.status);
		return response;
	} catch (error) {
		logRequest(event, Date.now() - start_time, 500, error as Error);
		throw error;
	}
};

// Ensure unhandled rejections and exceptions are logged
const processLogger = logger.child({ module: 'process' });

process.on('unhandledRejection', (reason, promise) => {
	processLogger.error({ reason, promise }, 'Unhandled Promise Rejection');
});

process.on('uncaughtException', (error) => {
	processLogger.error({ error: error.message, stack: error.stack }, 'Uncaught Exception');
});
