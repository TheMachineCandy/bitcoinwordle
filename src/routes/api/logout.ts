import type { RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';
import {
	userFromDb,
	updateUserSession,
	getUserSessionFromRequest
} from '$lib/components/_private/util';

export type Typify<T> = { [K in keyof T]: Typify<T[K]> };
type OutputType = Typify<string>;

export const post: RequestHandler<Record<string, string>, OutputType> = async ({ request }) => {
	try {
		const requestUserSession = getUserSessionFromRequest(request);
		if (!requestUserSession?.account) {
			throw new Error('User not found.');
		}
		const user = await userFromDb(requestUserSession.account);
		delete user.session;
		await updateUserSession(user);

		const headers = {
			'set-cookie': cookie.serialize('session_data', '', {
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 0,
				path: '/'
			})
		};

		return {
			status: 200,
			headers,
			body: 'success'
		};
	} catch (error) {
		console.log(error);
		return {
			status: 500
		};
	}
};
