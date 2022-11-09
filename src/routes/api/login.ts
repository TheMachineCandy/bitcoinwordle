import type { RequestHandler } from '@sveltejs/kit';
import { IdentityProof } from '@libre-chain/libre-signing-request';
import { JsonRpc } from 'eosjs';
import * as cookie from 'cookie';
import type { User, UserSession } from 'src/types';
import { userFromDb, updateUserSession, upsertUser } from '$lib/components/_private/util';

export type Typify<T> = { [K in keyof T]: Typify<T[K]> };
type OutputType = Typify<{ userSession: UserSession | null }>;

export const post: RequestHandler<Record<string, string>, OutputType> = async ({ request }) => {
	try {
		const res = await request.json();
		const proof: IdentityProof = res.proof;
		const acc: string = proof.signer.actor.toString();
		const verified = await verify(process.env['DEV_RPC_URI'] || '', acc, proof);

		if (verified) {
			const expiresTime = new Date();
			const expiresSeconds = 60 * 60 * 24 * 7;
			expiresTime.setSeconds(expiresSeconds);

			let user: User | null = await userFromDb(acc);
			if (user) {
				console.log('User found... Updating session');
				const session = { account: acc, token: generateSessionToken(), expiresTime: expiresTime };
				user.session = session;
				await updateUserSession(user);
			} else {
				console.log(`No User found... Creating User => ${acc}`);
				user = {
					account: acc,
					nextPlayTime: new Date(), // TODO: Might need to make past since new user,
					canPlay: true,
					session: { account: acc, token: generateSessionToken(), expiresTime: expiresTime }
				};
				user = (await upsertUser(user)).value;
			}

			if (user && user.session) {
				const headers = {
					'set-cookie': cookie.serialize('session_data', JSON.stringify(user.session), {
						httpOnly: true,
						sameSite: 'lax',
						maxAge: expiresSeconds,
						path: '/'
					})
				};

				return {
					status: 200,
					headers,
					body: {
						userSession: user.session
					}
				};
			} else {
				throw Error('Missing user or session token');
			}
		} else {
			throw Error('Unable to verify');
		}
	} catch (err: unknown) {
		console.log(err);
		if (err instanceof Error) {
			if (err.message === 'blacklisted') {
				return {
					status: 403
				};
			}
		}
		return {
			status: 500
		};
	}
};

function generateSessionToken() {
	// Math.random should be unique because of its seeding algorithm.
	// Convert it to base 36 (numbers + letters), and grab the first 9 characters
	// after the decimal.
	return '_' + Math.random().toString(36).substr(2, 9);
}

async function verify(rpcUri: string, acc: string, identityProof: IdentityProof) {
	try {
		const rpc = new JsonRpc(rpcUri, { fetch });
		const signer = await rpc.get_account(acc);
		const permissions = signer && signer.permissions;

		let signerPublicKey;

		for (const permission of permissions) {
			if (
				permission.perm_name &&
				permission.perm_name === 'active' &&
				permission.required_auth &&
				permission.required_auth.keys &&
				permission.required_auth.keys[0].key
			) {
				signerPublicKey = permission.required_auth.keys[0].key;
				break;
			}
		}

		const ip = IdentityProof.from(identityProof);
		const vp = ip.recover().toLegacyString();

		console.log(`signed with =>${vp}`);
		console.log(` chain => ${signerPublicKey}`);

		if (vp === signerPublicKey) {
			return true;
		} else {
			throw new Error('Unable to verify signature');
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
		throw new Error('Unknown error');
	}
}
