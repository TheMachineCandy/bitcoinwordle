import type { RequestHandler } from '@sveltejs/kit';
import type { Block, Game, User, Config } from 'src/types';
import {
	addGameToDb,
	blacklisted,
	configFromDb,
	getNextPlayTime,
	getUserSessionFromRequest,
	newGameAndUpdateDb,
	transact,
	upsertUser,
	userFromDb,
	validUserSession
} from '$lib/components/_private/util';
import words from '$lib/components/_private/words_5';

export type Typify<T> = { [K in keyof T]: Typify<T[K]> };
type OutputType = Typify<{ user: User | null }>;
type PostOutputType = Typify<{ game: Game | null }>;

export const get: RequestHandler<Record<string, string>, OutputType> = async ({
	params,
	request
}) => {
	try {
		const requestUserSession = getUserSessionFromRequest(request);
		if (params.account !== requestUserSession?.account) {
			throw new Error('User doesnt match session');
		}

		const account = params.account;
		if (!validUserSession(requestUserSession)) {
			throw new Error('User session expired');
		}

		let dbUser: User | null = await userFromDb(account);

		if (!dbUser) {
			throw new Error('Something went wrong finding user');
		}

		if (!dbUser.currentGame) {
			dbUser = (await newGameAndUpdateDb(dbUser)).value;
		}

		if (!dbUser) {
			throw new Error('Something went wrong finding user');
		}

		if (dbUser.blacklisted) {
			// REMOVE ANY PRIVATE STUFF
			delete dbUser?.currentGame?.word;
			delete dbUser?.currentGame;
			delete dbUser?._id;
			delete dbUser?.session;
			delete dbUser?.nextPlayTime;
		} else {
			// const blackisted = await blacklisted(dbUser.account);
			// if (blackisted) {
			// 	dbUser.blacklisted = true;
			// 	dbUser = (await upsertUser(dbUser)).value;
			// }

			if (dbUser && !dbUser.canPlay && dbUser?.nextPlayTime !== undefined) {
				if (dbUser?.nextPlayTime < new Date()) {
					dbUser.canPlay = true;
					dbUser = (await upsertUser(dbUser)).value;
				}
			}
			// REMOVE ANY PRIVATE STUFF
			delete dbUser?.currentGame?.word;
			delete dbUser?._id;
			delete dbUser?.session;
			delete dbUser?.nextPlayTime;
		}

		return {
			status: 200,
			body: { user: dbUser }
		};
	} catch (error) {
		console.log(error);
		return {
			status: 200,
			redirect: '/'
		};
	}
};

export const post: RequestHandler<Record<string, string>, PostOutputType> = async ({ request }) => {
	try {
		const requestUserSession = getUserSessionFromRequest(request);
		if (!requestUserSession?.account) {
			throw new Error('User not found.');
		}

		const data = await request.json();

		if (data && data.activeRow) {
			const activeRow: Block[] = data.activeRow;

			if (activeRow.length !== 5) {
				throw new Error('Active row length incorrect');
			}

			for (let i = 0; i < 5; i++) {
				if (
					/^[a-zA-Z]+$/.test(activeRow[i].character) === false ||
					activeRow[i].character.length !== 1
				) {
					throw new Error('Active row not valid inputs.');
				}
			}

			const user = await userFromDb(requestUserSession.account);

			if (!user.currentGame) {
				throw new Error('No game found for user');
			}

			let completeWord = '';
			for (let i = 0; i < 5; i++) {
				completeWord += activeRow[i].character;
			}

			// check winner
			if (completeWord === user.currentGame.word) {
				console.log('YOU WON');
				for (let i = 0; i < 5; i++) {
					activeRow[i].status = 'right';
				}
				user.currentGame.startTime = new Date();
				user.currentGame.won = true;
				user.currentGame.endTime = new Date();
				user.currentGame.grid[user.currentGame.activeRowIndex] = activeRow;
				user.currentGame.activeRowIndex++;
				user.currentGame.grid[user.currentGame.activeRowIndex] = [];
				user.nextPlayTime = getNextPlayTime();
				user.canPlay = false;

				const config: Config = (await configFromDb()) as Config;
				user.currentGame.sats = config.satsForWin;

				const amount = (config.satsForWin * 0.00000001).toFixed(9); // CHECK

				// SEND
				await transact(amount, user.account);

				user.currentGame.sendSuccess = true;

				const game = { ...user.currentGame };

				await addGameToDb(game);
				await newGameAndUpdateDb(user);

				return {
					status: 200,
					body: {
						game: game
					}
				};
			}

			// check not word
			if (!words.valid.includes(completeWord) && !words.words.includes(completeWord)) {
				// not a valid guess
				user.currentGame.grid[user.currentGame.activeRowIndex] = activeRow;
				// return game as is
				const game = { ...user.currentGame };
				return {
					status: 200,
					body: {
						game: game
					}
				};
			}

			// check letters for correct positions
			const word: string[] = user.currentGame.word?.split('') || [];

			for (let i = 0; i < 5; i++) {
				if (word[i] === activeRow[i].character) {
					// right
					user.currentGame.grid[user.currentGame.activeRowIndex][i] = activeRow[i];
					user.currentGame.grid[user.currentGame.activeRowIndex][i].status = 'right';
				} else if (word.includes(activeRow[i].character)) {
					// semi-right
					user.currentGame.grid[user.currentGame.activeRowIndex][i] = activeRow[i];
					user.currentGame.grid[user.currentGame.activeRowIndex][i].status = 'semi-right';
				} else {
					// wrong
					user.currentGame.grid[user.currentGame.activeRowIndex][i] = activeRow[i];
					user.currentGame.grid[user.currentGame.activeRowIndex][i].status = 'wrong';
				}
			}

			if (
				user.currentGame.grid.length == 6 &&
				activeRow.findIndex((object) => {
					return object.status === '';
				})
			) {
				// lost
				user.currentGame.won = false;
				user.currentGame.endTime = new Date();
				user.currentGame.grid[user.currentGame.activeRowIndex] = activeRow;
				user.currentGame.activeRowIndex++;
				user.currentGame.grid[user.currentGame.activeRowIndex] = [];
				user.nextPlayTime = getNextPlayTime();
				user.canPlay = false;

				const game = { ...user.currentGame };

				// TODO: Should we keep lost games?

				await newGameAndUpdateDb(user);

				return {
					status: 200,
					body: {
						game: game
					}
				};
			} else {
				user.currentGame.startTime = new Date();
				user.currentGame.activeRowIndex++;
				user.currentGame.grid[user.currentGame.activeRowIndex] = [];
				const game = { ...user.currentGame };

				// update
				await upsertUser(user);
				return {
					status: 200,
					body: {
						game: game
					}
				};
			}
		} else {
			throw new Error('Unable to parse body.');
		}
	} catch (error) {
		console.log(error);
		return {
			status: 500
		};
	}
};
