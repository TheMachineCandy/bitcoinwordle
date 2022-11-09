import type { ObjectId } from 'mongodb';

export interface User {
	account: string;
	currentGame?: Game;
	nextPlayTime?: Date;
	canPlay: boolean;
	session?: UserSession;
	blacklisted?: boolean;
	_id?: ObjectId;
}

export interface Game {
	account: string;
	word?: string;
	grid: Block[][];
	activeRowIndex: number;
	startTime?: Date;
	endTime?: Date;
	won?: boolean;
	sats?: number;
	sendSuccess?: boolean;
	_id?: ObjectId;
}

export interface Block {
	character: string;
	status: string;
}

export interface UserSession {
	account: string;
	token: string;
	expiresTime: Date;
}

export interface LeaderboardItem {
	account: string;
	won: number;
	lost: number;
	lastGameTime?: Date;
	_id?: ObjectId;
}

export interface Config {
	online: boolean;
	satsForWin: number;
	cut: number;
	_id?: ObjectId;
}
