import cookie from 'cookie';
import type { GetSession, Handle } from '@sveltejs/kit';
import type { UserSession } from './types';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	if (cookies && cookies['session_data']) {
		try {
			const userSession: UserSession = JSON.parse(cookies['session_data']);
			event.locals.userSession = userSession;
		} catch (error) {
			console.log(`Session error: ${error}`);
		}
	}
	return await resolve(event);
};

export const getSession: GetSession = (event) => {
	if (!event.locals.userSession) return {};
	return {
		userSession: event.locals.userSession
	};
};
