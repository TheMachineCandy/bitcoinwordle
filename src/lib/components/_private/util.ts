import type { Game, User, UserSession } from 'src/types';
import cookie from 'cookie';
import clientPromise from './mongodb-client';
import type { ReturnDocument } from 'mongodb';
import words from './words_5';
import type { Config } from '@sveltejs/kit';
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

import dotenv from 'dotenv';
dotenv.config();

const PKEY: string = process.env['PKEY'] || '';

export function getUserSessionFromRequest(request: Request) {
	const cookies = cookie.parse(request.headers.get('cookie') || '');
	if (cookies && cookies['session_data']) {
		try {
			const userSession: UserSession = JSON.parse(cookies['session_data']);
			return userSession;
		} catch (error) {
			console.log(`Session error: ${error}`);
		}
	}
}

export function validUserSession(userSession: UserSession) {
	const today = new Date();
	return !(userSession.expiresTime < today);
}

export async function configCollection() {
	const connection = await clientPromise;
	const db = connection.db('wordle');
	return db.collection<Config>('config');
}

export async function configFromDb() {
	const collection = await configCollection();
	return (await collection.findOne()) as Config;
}

export async function gameCollection() {
	const connection = await clientPromise;
	const db = connection.db('wordle');
	return db.collection<Game>('games');
}

export async function addGameToDb(game: Game) {
	const collection = await gameCollection();
	return await collection.insertOne(game);
}

export async function userCollection() {
	const connection = await clientPromise;
	const db = connection.db('wordle');
	return db.collection<User>('users');
}

export async function userFromDb(account: string) {
	const collection = await userCollection();
	return (await collection.findOne({ account: account })) as User;
}

export async function upsertUser(user: User) {
	const collection = await userCollection();
	const options = { upsert: true, returnDocument: 'after' as ReturnDocument };
	return await collection.findOneAndUpdate({ account: user.account }, { $set: user }, options);
}

export async function updateUserSession(user: User) {
	const collection = await userCollection();
	return await collection.findOneAndUpdate({ _id: user._id }, { $set: { session: user.session } });
}

export async function newGameAndUpdateDb(user: User) {
	const game: Game = {
		account: user.account,
		word: getRandomWord(),
		grid: [[]],
		activeRowIndex: 0
	};
	user.currentGame = game;
	return await upsertUser(user);
}

export function getRandomWord() {
	return words.words[Math.floor(Math.random() * words.words.length)];
}

export function getNextPlayTime() {
	const date = new Date();
	return new Date(date.getTime() + getRandomIntInclusive(60, 360) * 1000);
}

export function getRandomIntInclusive(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusiv
}

export async function blacklisted(account: string) {
	const checkBlisted = await fetch(`https://api.libre.org/challenge/${account}`);
	const bjson = await checkBlisted.json();
	if (bjson['blacklist'] === true) {
		return true;
	}
	return false;
}

async function transact(amount: string, to: string) {
	const signatureProvider = new JsSignatureProvider([PKEY]);
	const nodeUrl = process.env['DEV_RPC_URI'] || '';
	const rpc = new JsonRpc(nodeUrl, { fetch });
	const api = new Api({
		rpc,
		signatureProvider,
		textDecoder: new TextDecoder(),
		textEncoder: new TextEncoder()
	});

	try {
		const result = await api.transact(
			{
				actions: [
					{
						account: 'btc.ptokens',
						name: 'transfer',
						authorization: [
							{
								actor: 'bitcoinwrdle',
								permission: 'active'
							}
						],
						data: {
							from: 'bitcoinwrdle',
							to: to,
							quantity: `${amount} PBTC`,
							memo: '🟩 🟩 🟩 🟩 🟩 Congratulations! Some ₿ for your great score!'
						}
					}
				]
			},
			{
				blocksBehind: 3,
				expireSeconds: 30
			}
		);
		return result;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export { transact };
